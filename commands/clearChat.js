/// <reference path>
const { SlashCommandBuilder } = require('discord.js')

const clearChat = async ({ options }) => {
  const channel = options.getChannel('channel')
  const messagesToDelete = await channel.messages.fetch()

  await channel.bulkDelete(messagesToDelete, true)
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('limpiar')
    .setDescription('Limpia el chat del canal actual')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription(`Ingresá el canal del cual queres limpiar el chat.`)
        .setRequired(true)
    ),
  async execute(interaction) {
    await clearChat(interaction)
    await interaction.reply('Se ha limpiado el chat')
  },
}
