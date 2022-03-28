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

    if (msg.channel.id != config.DiscordChannel) {
        return
    }
    var content = msg.cleanContent

    if (content.search('twitter.com') != -1) {
        var url = content.match(/(https?:\/\/[^ ]*)/)[1];
        var attachments = [] 
        const twtScraper = await TwitterScraper.create();
        const tweetMeta = await twtScraper.getTweetMeta(url);
        
        if (tweetMeta.isImage) {
            for (const image of tweetMeta.media_url) {
                attachments.push(image.url)
            }
            if (attachments.length >= 1) {
                msg.channel.send({
                    content: '<'+url+'>',
                    files: attachments
                })
            }

        }
    }
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(config.DiscordToken)