const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'spotify',
    description: 'Mostra a música que um usuário está ouvindo no Spotify',
    execute(message) {
        const user = message.mentions.users.first() || message.author;
        const member = message.guild.members.cache.get(user.id);

        // Verifica se o usuário está ouvindo Spotify
        const activity = member.presence?.activities.find(
            (act) => act.type === 2 && act.name === 'Spotify'
        );

        if (!activity) {
            return message.channel.send(`${user.username} não está ouvindo nada no Spotify agora.`);
        }

        // Cria o embed com informações da música
        const embed = new EmbedBuilder()
            .setAuthor({ name: `${user.username} está ouvindo:` })
            .setTitle(activity.details)
            .setDescription(`Artista: ${activity.state}\nÁlbum: ${activity.assets.largeText}`)
            .setThumbnail(`https://i.scdn.co/image/${activity.assets.largeImage.slice(8)}`)
            .setColor('#1DB954')
            .setFooter({ text: 'Usando o Rich Presence do Discord' });

        message.channel.send({ embeds: [embed] });
    },
};
