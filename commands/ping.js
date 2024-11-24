const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Mostra a latência do bot e outras informações úteis.',
    async execute(message, args) {
        const startTime = Date.now(); // Marca o início do processamento
        const msg = await message.channel.send('Calculando ping...');
        const endTime = Date.now(); // Marca o tempo após a resposta

        const latency = endTime - startTime; // Calcula o tempo de latência
        const apiLatency = message.client.ws.ping; // Obtém a latência da API WebSocket

        const embed = new EmbedBuilder()
            .setColor('#00ff00') // Cor verde
            .setTitle('🏓 Pong!')
            .addFields(
                { name: 'Latência do Bot', value: `${latency}ms`, inline: true },
                { name: 'Latência da API', value: `${apiLatency}ms`, inline: true },
                { name: 'Status', value: '🟢 Online', inline: true }
            )
            .setFooter({ text: `Comando solicitado por ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        msg.edit({ content: null, embeds: [embed] });
    },
};
