require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits, Events, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot is running'));
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// Criação do cliente
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

// Configurações
const prefix = '+!';
client.commands = new Collection();

// Carregar comandos da pasta "commands"
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Evento de início
client.once(Events.ClientReady, () => {
    console.log('Bot online!');
    client.user.setActivity('Brazil Zil Zil', { type: 'WATCHING' });
    client.user.setPresence({
        activities: [{ name: 'criado por um cara muito foda!', type: 'PLAYING' }],
        status: 'online',
    });
});

// Funções auxiliares
const normalizeCommand = (command) => {
    if (!command) return '';
    return command.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

const isCommand = (message) => message.content.startsWith(prefix);

const getCorrectCommand = (commandName) => {
    const normalizedCommandName = normalizeCommand(commandName);
    const commandNames = Array.from(client.commands.keys()).map(normalizeCommand);
    const matches = commandNames.filter(name => name.startsWith(normalizedCommandName) || name.includes(normalizedCommandName));
    return matches.length > 0 ? matches[0] : null;
};

// Evento MessageCreate
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    if (message.mentions.has(client.user)) {
        return await message.channel.send(`Olá, ${message.author.username}! Como posso ajudar? meu prefixo padrao é +!`);
    }

    if (!isCommand(message)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const correctCommandName = getCorrectCommand(commandName);

    if (correctCommandName) {
        const command = client.commands.get(correctCommandName);
        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.channel.send('Ocorreu um erro ao executar o comando!');
        }
    } else {
        message.channel.send('Desculpe, não entendi o comando.');
    }
});

// Login do bot
client.login(process.env.TOKEN);
