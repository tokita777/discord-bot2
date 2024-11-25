const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'horario',
    description: 'Mostra o horário atual de qualquer lugar do mundo.',
    async execute(message, args) {
        if (!args.length) {
            return message.reply('Por favor, informe a cidade ou região (exemplo: São Paulo, Brasil).');
        }

        const location = args.join(' ');

        try {
            // Chaves de API
            const weatherApiKey = '9d92d3b09ac1c3291741549e49f90e20'; // Substitua com sua chave do OpenWeatherMap
            const timezoneApiKey = 'RUMGOXU9M87K'; // Substitua com sua chave do TimeZoneDB

            // Geocodificação: Obtendo a latitude e longitude com OpenWeatherMap
            const geocodingResponse = await axios.get(
                `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${weatherApiKey}`
            );

            if (!geocodingResponse.data.length) {
                return message.reply('Não consegui encontrar o local informado. Verifique o nome e tente novamente.');
            }

            const { lat, lon } = geocodingResponse.data[0];

            // Obtendo o horário atual com TimeZoneDB
            const timeResponse = await axios.get(
                `http://api.timezonedb.com/v2.1/get-time-zone?key=${timezoneApiKey}&format=json&by=position&lat=${lat}&lng=${lon}`
            );

            const data = timeResponse.data;

            const embed = new EmbedBuilder()
                .setColor('#3498db') // Azul
                .setTitle(`🕒 Horário atual em ${location}`)
                .addFields(
                    { name: 'Data', value: data.formatted.split(' ')[0], inline: true },
                    { name: 'Horário', value: data.formatted.split(' ')[1], inline: true },
                    { name: 'Fuso Horário', value: data.abbreviation, inline: true },
                )
                .setFooter({ text: `Solicitado por ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            message.reply('Ocorreu um erro ao buscar o horário. Verifique o nome do local e tente novamente.');
        }
    },
};
