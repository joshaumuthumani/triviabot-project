    const { Client, GatewayIntentBits } = require('discord.js');
    require('dotenv').config();
    const axios = require('axios');

    const BACKEND_URL = process.env.BACKEND_URL;
    const CHANNEL_ID = process.env.TRIVIA_CHANNEL_ID;

    const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
    });

    // State tracking
    let lastQuestionId = null;
    let lastQuestion = null;
    let attemptedUsers = new Set();
    let winner = null;
    let announcementTimer = null;
    // Prevent duplicate announcements
    const announcedQuestions = new Set();

    // On bot ready
    client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    // On startup, fetch any existing question and schedule announcement if in future
    try {
        const resp = await axios.get(`${BACKEND_URL}/api/questions/latest`);
        const q = resp.data;
        if (q && q._id) {
        lastQuestionId = q._id;
        lastQuestion = q;
        scheduleAnnouncement();
        }
    } catch (err) {
        console.error('Startup fetch error:', err.message);
    }
    });

    // Handle incoming messages
    client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.mentions.has(client.user)) return;

    // Fetch the latest question
    let resp;
    try {
        resp = await axios.get(`${BACKEND_URL}/api/questions/latest`);
    } catch (err) {
        return message.reply('⚠️ Could not fetch the current question.');
    }
    const q = resp.data;

    // No active question
    if (!q || !q._id) {
        return message.reply('No active trivia question right now.');
    }

    // New question detected
    if (q._id !== lastQuestionId) {
        lastQuestionId = q._id;
        lastQuestion = q;
        attemptedUsers.clear();
        winner = null;
        scheduleAnnouncement();
    }

    // Removed expiration check to allow answers until scheduled announcement.

    const userId = message.author.id;
    if (attemptedUsers.has(userId)) {
        return message.reply('You have already attempted this question.');
    }
    attemptedUsers.add(userId);

    const attempt = message.content.replace(/<@!?(\d+)>/, '').trim();
    if (attempt.toLowerCase() === q.answer.toLowerCase()) {
        winner = { id: userId, tag: message.author.tag };
        await message.reply('✅ Answer accepted! Good luck to everyone.');
    } else {
        await message.reply('❌ Sorry, that is incorrect.');
    }
    });

    // Schedule the end-of-question announcement
    function scheduleAnnouncement() {
    if (!lastQuestion || !lastQuestion.endTime) return;

    const now = Date.now();
    const end = new Date(lastQuestion.endTime).getTime();
    const delay = end - now;

    // Only schedule if endTime is in the future
    if (delay > 0) {
        if (announcementTimer) clearTimeout(announcementTimer);
        console.log('⏱️ Scheduling announcement at:', new Date(lastQuestion.endTime).toLocaleString());
        announcementTimer = setTimeout(announceResult, delay);
    } else {
        console.log('⏱️ Skipping scheduling: endTime already passed');
    }
    }

    // Announce the result when time is up
    async function announceResult() {
    // Prevent duplicate announcements for the same question
    if (!lastQuestionId || announcedQuestions.has(lastQuestionId)) return;
    announcedQuestions.add(lastQuestionId);

    try {
        const channel = await client.channels.fetch(CHANNEL_ID);
        if (!channel) throw new Error('Channel not found');

        console.log('⏰ Announcing result for question:', lastQuestion.question,
                    'ends at', lastQuestion.endTime);

        if (winner) {
        await channel.send(`🏆 Time's up! The winner is <@!${winner.id}> with the correct answer **${lastQuestion.answer}**!`);
        } else {
        await channel.send(`⏰ Time's up! No winners. The correct answer was **${lastQuestion.answer}**.`);
        }

    } catch (err) {
        console.error('Announcement error:', err.message);
    } finally {
        // Reset local state
        lastQuestionId = null;
        lastQuestion = null;
        attemptedUsers.clear();
        winner = null;
        if (announcementTimer) {
        clearTimeout(announcementTimer);
        announcementTimer = null;
        }
    }
    }

    client.login(process.env.DISCORD_TOKEN);
