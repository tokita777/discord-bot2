const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'horario',
    description: 'Mostra o horário atual de qualquer lugar do mundo.',
    async execute(message, args) {
        if (!args.length) {
            return message.reply('Por favor, informe a cidade ou região (exemplo: America/Sao_Paulo).');
        }

        const location = args.join('_'); // Substitui espaços por underline para o formato esperado

        try {
            const response = await axios.get(`https://worldtimeapi.org/api/timezone/${encodeURIComponent(location)}`);
            const data = response.data;

            const currentTime = new Date(data.datetime); // Converte a string para um objeto Date
            const embed = new EmbedBuilder()
                .setColor('#3498db') // Azul
                .setTitle(`🕒 Horário atual em ${location.replace('_', ' ')}`)
                .addFields(
                    { name: 'Data', value: currentTime.toLocaleDateString(), inline: true },
                    { name: 'Horário', value: currentTime.toLocaleTimeString(), inline: true },
                    { name: 'Fuso Horário', value: data.timezone, inline: true },
                )
                .setFooter({ text: `Solicitado por ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('Não consegui encontrar o horário para o local informado. Verifique o nome e tente novamente.');
        }
    },
};
