const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'invite',
    description: 'manda o convite do bot',
    async execute(message, args) {
        // Define as permissões do bot (você pode personalizar isso)
        const permissions = new PermissionsBitField([
            PermissionsBitField.Flags.Administrator
        ]);

        try {
            // Gera o link de convite com as permissões definidas
            const inviteLink = await message.client.generateInvite({ permissions });

            // Responde com o link de convite
            message.channel.send(`Convide o bot usando este link: ${inviteLink}`);
        } catch (error) {
            console.error(error);
            message.channel.send('Houve um erro ao gerar o link de convite.');
        }
    }
};
