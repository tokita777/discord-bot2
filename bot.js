require('dotenv').config();
const { Client, GatewayIntentBits, Events, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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

const PORT = process.env.PORT || 3000; // Ignorar a porta se não estiver sendo usada

// Carregar comandos da pasta "commands"
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Evento de início
client.once(Events.ClientReady, () => {
    console.log('Bot online!');

    // Configura o status "Sobre mim"
    client.user.setActivity('Brazil Zil Zil', { type: 'WATCHING' });
    
    // Define o "Sobre mim" no perfil do bot
    client.user.setPresence({
        activities: [{ name: 'criado por um cara muito foda!', type: 'PLAYING' }],
        status: 'online', // Define o status do bot
    });
});

// Função para remover acentos
const normalizeCommand = (command) => {
    return command.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

// Função para verificar se a mensagem é um comando
const isCommand = (message) => {
    return message.content.startsWith(prefix);
};

// Função para corrigir o comando, permitindo variações como "abracar" para "abraçar"
const getCorrectCommand = (commandName) => {
    const normalizedCommandName = normalizeCommand(commandName);
    const commandNames = Array.from(client.commands.keys()).map(normalizeCommand);
    
    const matches = commandNames.filter(name => name.startsWith(normalizedCommandName) || name.includes(normalizedCommandName));
    return matches.length > 0 ? matches[0] : null; // Retorna o primeiro comando que corresponder ou null
};

// Evento quando uma nova mensagem é criada
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return; // Ignora mensagens de outros bots

    // Ignorar mensagens que não começam com o prefixo
    if (!isCommand(message)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Verificar se o comando existe ou corrigir o comando
    const correctCommandName = getCorrectCommand(commandName);

    if (correctCommandName) {
        const command = client.commands.get(correctCommandName);
        try {
            await command.execute(message, args); // Executa o comando
        } catch (error) {
            console.error(error);
            message.channel.send('Ocorreu um erro ao executar o comando!');
        }
    } else {
        message.channel.send(`Desculpe, não entendi o comando. Você quis dizer "${prefix}${correctCommandName}"?`);
    }
});

// Exemplo de comando com botões interativos
client.on(Events.MessageCreate, async (message) => {
    if (message.content === `${prefix}interagir`) {
        // Cria uma linha de botões
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('like')
                    .setLabel('👍 Curtir')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('dislike')
                    .setLabel('👎 Não curtir')
                    .setStyle(ButtonStyle.Danger)
            );

        // Envia a mensagem com os botões
        await message.channel.send({
            content: 'Você quer curtir ou não curtir?',
            components: [row],
        });
    }
});

// Resposta ao botão clicado
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'like') {
        await interaction.reply('Você curtiu!');
    } else if (interaction.customId === 'dislike') {
        await interaction.reply('Você não curtiu.');
    }
});

// Login do bot usando o token do .env
client.login(process.env.TOKEN);
