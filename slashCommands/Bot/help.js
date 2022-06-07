const { readdirSync } = require("fs");

// Help SlashCommand'in nasıl oluşturulacağına dair örnek

module.exports = {
    name: "help",
    usage: '/help <command>',
    options: [
        {
            name: 'command',
            description: 'What command do you need help',
            type: 'STRING',
            required: false
        }
    ],
    category: "Bot",
    description: "Return all commands, or one specific command!",
    ownerOnly: false,
    run: async (client, interaction) => {

        // Sizi bir bağlantıya götüren düğmeler
        // Bunları silmek istiyorsanız, bu bölümü kaldırın.
        // the code and in line: 62 delete ", components: [row]"
        const row = new client.discord.MessageActionRow()
            .addComponents(
                new client.discord.MessageButton()
                    .setLabel("GitHub")
                    .setStyle("LINK")
                    .setURL("https://github.com/Expectatives/Discord.js-v13-Example"),
                new client.discord.MessageButton()
                    .setLabel("Support")
                    .setStyle("LINK")
                    .setURL("https://dsc.gg/faithcommunity")
            );

        const commandInt = interaction.options.getString("command");
        if (!commandInt) {

            // Bir Bot kategorisinin eğik çizgi komutlarını alın
            const botCommandsList = [];
            readdirSync(`./slashCommands/Bot`).forEach((file) => {
                const filen = require(`../../slashCommands/Bot/${file}`);
                const name = `\`${filen.name}\``
                botCommandsList.push(name);
            });

            // Bir Yardımcı Program kategorisinin eğik çizgi komutlarını alın
            const utilityCommandsList = [];
            readdirSync(`./slashCommands/Utility`).forEach((file) => {
                const filen = require(`../../slashCommands/Utility/${file}`);
                const name = `\`${filen.name}\``
                utilityCommandsList.push(name);
            });

            // Bu, komutu argümanlar olmadan kullanırken verdiği komuttur.
            const helpEmbed = new client.discord.MessageEmbed()
                .setTitle(`${client.user.username} SlashHelp`)
                .setDescription(` Hello **<@${interaction.member.id}>**, I am <@${client.user.id}>.  \nYou can use \`/help <slash_command>\` to see more info about the SlashCommands!\n**Total Commands:** ${client.commands.size}\n**Total SlashCommands:** ${client.slash.size}`)
                .addField("🤖 - Bot SlashCommands", botCommandsList.map((data) => `${data}`).join(", "), true)
                .addField("🛠 - Utility SlashCommands", utilityCommandsList.map((data) => `${data}`).join(", "), true)
                .setColor(client.config.embedColor)
                .setFooter({ text: `${client.config.embedfooterText}`, iconURL: `${client.user.displayAvatarURL()}` });

            interaction.reply({ embeds: [helpEmbed], components: [row] });
        } else {
            const command = client.slash.get(commandInt.toLowerCase());

            // Komutu argümanla kullanırken gönderdiği şey budur ve komutu bulamaz.
            if (!command) {
                interaction.reply({ content: `There isn't any SlashCommand named "${commandInt}"` });
            } else {

                // Komutu argümanla kullanırken ve komutu bulursa gönderdiği şey budur.
                let command = client.slash.get(commandInt.toLowerCase());
                let name = command.name;
                let description = command.description || "No descrpition provided"
                let usage = command.usage || "No usage provided"
                let category = command.category || "No category provided!"

                let helpCmdEmbed = new client.discord.MessageEmbed()
                    .setTitle(`${client.user.username} Help | \`${(name.toLocaleString())}\` SlashCommand`)
                    .addFields(
                        { name: "Description", value: `${description}` },
                        { name: "Usage", value: `${usage}` },
                        { name: 'Category', value: `${category}` })
                    .setColor(client.config.embedColor)
                    .setFooter({ text: `${client.config.embedfooterText}`, iconURL: `${client.user.displayAvatarURL()}` });

                interaction.reply({ embeds: [helpCmdEmbed] });
            }
        }
    },
};
