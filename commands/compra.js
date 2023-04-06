const { SlashCommandBuilder } = require('discord.js')
const { default: puppeteer } = require('puppeteer')

const dolarValue = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
    })
    const page = await browser.newPage()

    await page.goto(
      'https://www.cronista.com/MercadosOnline/moneda.html?id=ARS',
      {
        waitUntil: 'domcontentloaded',
      }
    )

    const dolarData = await page.evaluate(() => {
      const dolar = document.querySelector('.sell-value').innerText

      return { dolar }
    })
    const dolarValue = dolarData['dolar'].replace(/[$"]/g, '').replace(',', '.')
    await browser.close()

    return dolarValue
  } catch (error) {
    console.log(error)
  }
}

const dolarPurchase = async (value) => {
  return `El precio final de tu compra de ***US$${value}*** es:\n
  ***${((await dolarValue()) * value * 1.75).toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
  })}***`
}

const pesoPurchase = async (value) => {
  return `El precio final de tu compra de ***$ ${value}*** es:\n
  ***${(value * 1.75).toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
  })}***`
}

const performOperation = async ({ _hoistedOptions }) => {
  const value = _hoistedOptions[1].value
  const finalValue =
    _hoistedOptions[0].value === 'usd'
      ? await dolarPurchase(value)
      : pesoPurchase(value)
  return finalValue
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('compra')
    .setDescription('Te dice el precio final de una compra !')
    .addStringOption((option) =>
      option
        .setName('moneda')
        .setDescription('La moneda de la compra')
        .setRequired(true)
        .addChoices(
          { name: 'Dolar', value: 'usd' },
          { name: 'Peso Argentino', value: 'ars' }
        )
    )
    .addNumberOption((option) =>
      option
        .setName('precio')
        .setDescription('Monto de la compra')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply()
    await interaction.editReply(
      `${await performOperation(interaction.options)}`
    )
  },
}
