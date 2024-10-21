const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'info',
    description: 'Exibe informações sobre o bot.',
    async execute(message) {
        const infoEmbed = new EmbedBuilder()
            .setColor('#ff69b4') // Cor rosa
            .setTitle('Informações do Bot')
            .setDescription('Olá, meu nome é **Lilith** 😸! Meu prefixo padrão é **+!**\nEstou aqui para lhe servir! Sou sua maid pessoal 🌸')
            .addFields(
                { name: 'Criador', value: 'Bot criado por **toki.66**' },
                { name: 'Linguagem', value: 'Feito em **JavaScript**' }
            )
            .setThumbnail('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfPJvzckB5QyW7MvvwLfWtVCI554Gw_msKZV7W9p3g03s0qggC4qJrjUYA&s=10') // URL de uma imagem do bot
            .setFooter({ text: 'Lilith, sua maid pessoal 🌸', iconURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_FUNpkbm3tJHYt4I6WjtOtdizk-LcgPi0YA&s' });

        await message.channel.send({ embeds: [infoEmbed] });
    }
};
