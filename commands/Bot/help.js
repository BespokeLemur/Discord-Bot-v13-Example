const { readdirSync } = require("fs");

// Yardım Komutunun nasıl oluşturulacağına dair örnek

module.exports = {
    name: "help",
    aliases: ["h", "commands"],
    usage: '!help <command>',
    category: "Bot",
    description: "Return all commands, or one specific command!",
    ownerOnly: false,
    run: async (client, message, args) => {

        // Sizi bir bağlantıya götüren düğmeler
        // Bunları silmek istiyorsanız, bu bölümü kaldırın.
        // the code and in line: 55 delete ", components: [row]"
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

        if (!args[0]) {

            // Bir Bot kategorisinin komutlarını alın
            const botCommandsList = [];
            readdirSync(`./commands/Bot`).forEach((file) => {
                const filen = require(`../../commands/Bot/${file}`);
                const name = `\`${filen.name}\``
                botCommandsList.push(name);
            });

            // Bir Yardımcı Program kategorisinin komutlarını alın
            const utilityCommandsList = [];
            readdirSync(`./commands/Utility`).forEach((file) => {
                const filen = require(`../../commands/Utility/${file}`);
                const name = `\`${filen.name}\``
                utilityCommandsList.push(name);
            });

            // Bu, komutu argümanlar olmadan kullanırken verdiği komuttur.
            const helpEmbed = new client.discord.MessageEmbed()
                .setTitle(`${client.user.username} Help`)
                .setDescription(` Hello **<@${message.author.id}>**, I am <@${client.user.id}>.  \nYou can use \`!help <command>\` to see more info about the commands!\n**Total Commands:** ${client.commands.size}\n**Total SlashCommands:** ${client.slash.size}`)
                .addField("🤖 - Bot Commands", botCommandsList.map((data) => `${data}`).join(", "), true)
                .addField("🛠 - Utility Commands", utilityCommandsList.map((data) => `${data}`).join(", "), true)
                .setColor(client.config.embedColor)
                .setFooter({ text: `${client.config.embedfooterText}`, iconURL: `${client.user.displayAvatarURL()}` });

            message.reply({ embeds: [helpEmbed], allowedMentions: { repliedUser: false }, components: [row] });
        } else {
            const command = client.commands.get(args[0].toLowerCase()) || client.commands.find((c) => c.aliases && c.aliases.includes(args[0].toLowerCase()));

            // Komutu argümanla kullanırken gönderdiği şey budur ve komutu bulamaz.
            if (!command) {
                message.reply({ content: `There isn't any command named "${args[0]}"`, allowedMentions: { repliedUser: false } });
            } else {

                // Komutu argümanla kullanırken ve komutu bulursa gönderdiği şey budur.
                let command = client.commands.get(args[0].toLowerCase()) || client.commands.find((c) => c.aliases && c.aliases.includes(args[0].toLowerCase()));
                let name = command.name;
                let description = command.description || "No descrpition provided"
                let usage = command.usage || "No usage provided"
                let aliases = command.aliases || "No aliases provided"
                let category = command.category || "No category provided!"

                let helpCmdEmbed = new client.discord.MessageEmbed()
                    .setTitle(`${client.user.username} Help | \`${(name.toLocaleString())}\` Command`)
                    .addFields(
                        { name: "Description", value: `${description}` },
                        { name: "Usage", value: `${usage}` },
                        { name: "Aliases", value: `${aliases}` },
                        { name: 'Category', value: `${category}` })
                    .setColor(client.config.embedColor)
                    .setFooter({ text: `${client.config.embedfooterText}`, iconURL: `${client.user.displayAvatarURL()}` });

                message.reply({ embeds: [helpCmdEmbed], allowedMentions: { repliedUser: false } });
            }
        }
    },
};
