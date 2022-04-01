const { TwitterScraper } = require("@tcortega/twitter-scraper");
const Discord = require('discord.js');
const config = require('./config.json')

var Intents = Discord.Intents
const client = new Discord.Client({ partials: [ 'USER', 'MESSAGE'], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ', err);
});

process.on('unhandledRejection', function(err) {
    console.log('Caught exception: ', err);
});




client.on('messageCreate', async msg => {
    if (msg.author.id == client.user.id) { return }

    if (!config.DiscordChannels) {
        console.log("Please configure the Discord Channels in the config.json")
        process.exit(1)
        return
    }


    if (config.DiscordChannels.includes(msg.channel.id)) {
        var content = msg.cleanContent

        if (content.search('twitter.com') != -1) {
            var url = ""
            try {
                url = content.match(/(https?:\/\/[^ ]*)/)[1];
            } catch {
                return false
            }
            if (msg.attachments.first()) { return }
            var attachments = [] 
            const twtScraper = await TwitterScraper.create();
            const tweetMeta = await twtScraper.getTweetMeta(url);
            
            if (tweetMeta.isImage) {
                for (const image of tweetMeta.media_url) {
                    var imageURL = image.url.replace('.jpg', '.png')+'?format=png&name=large'
                    attachments.push(imageURL)
                }
                if (attachments.length >= 1) {
                    msg.channel.send({
                        content: '<'+url+'>',
                        files: attachments
                    })
                }
    
            }
        }
    }
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(config.DiscordToken)