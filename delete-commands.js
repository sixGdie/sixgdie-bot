const { REST, Routes } = require('discord.js')
require('dotenv').config()

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)

// ...

// for guild-based commands
rest
  .delete(
    Routes.applicationCommand(process.env.CLIENT_ID, '1087421992258506772')
  )
  .then(() => console.log('Successfully deleted application command'))
  .catch(console.error)
