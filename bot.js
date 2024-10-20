require('dotenv').config();
const { Client, GatewayIntentBits, Events, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

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

// Carregar comandos
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Evento de início
client.once(Events.ClientReady, () => {
    console.log('Bot online!');
    client.user.setActivity('Brazil Zil Zil', { type: 'WATCHING' });
});

// Função para verificar comandos
const isCommand = (message) => message.content.startsWith(prefix);

// Evento de mensagem
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    // Responder quando mencionado
    if (message.mentions.has(client.user)) {
        await message.channel.send(`Olá, ${message.author.username}! Como posso ajudar? meu prefixo padrao é +!`);
    }

    if (!isCommand(message)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    if (command) {
        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.channel.send('Ocorreu um erro ao executar o comando! Por favor, tente novamente.');
        }
    } else {
        message.channel.send(`Desculpe, não entendi o comando. Use \`${prefix}help\` para ver a lista de comandos.`);
    }
});

// Login do bot
client.login(process.env.TOKEN);
