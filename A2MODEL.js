const Discord = require('discord.js');
const moment = require("moment");
const { badwords } = require("./crave.json"); // you can change words in crave.json
const fs = require('fs').promises;
require("moment-duration-format");

const client = new Discord.Client({ disableEverone: true});

client.on('ready', () => {
    console.log('Bot is Launced!')
});

//print ping to your server
client.on('message', message => {
    var prefix = '>' //you can change your prefix
    if(message.author.bot || !message.guild) return;
    if(!message.content.startsWith(prefix)) return;

    if(message.content.startsWith(prefix + "ping")) {
        const startTime = Date.now();
        message.channel.send(`Pong!`)
        .then(msg=>{
            const endTime = Date.now();
            msg.edit(`Pong! (${endTime -startTime}ms)`);
        });
    }
	
	//usage(>userinfo @nickname) show user infos
    if(message.content.startsWith(prefix + "userinfo")) {
        let user = message.mentions.users.first() || message.author;

        let userinfo = {};
        userinfo.avatar = user.displayAvatarURL()
        userinfo.name = user.username;
        userinfo.discrim - `#${user.discriminator}`;
        userinfo.id = user.id;
        userinfo.registered = moment.utc(message.guild.members.cache.get(user.id).user.createdAt).format("dddd, MMMM Do, YYYY");
        userinfo.joined = moment.utc(message.guild.members.cache.get(user.id).joinedAt).format("dddd, MMMM Do, YYYY");

        const embed = new Discord.MessageEmbed()
        .setAuthor(user.tag, userinfo.avatar)
        .setThumbnail(userinfo.avatar)
        .addField(`Username`, userinfo.name, true)
        .addField(`Discriminator`, userinfo.discrim, true)
        .addField(`ID`, userinfo.id, true)
        .addField(`Registered`, userinfo.registered)
        .addField(`Joined`, userinfo.joined)

        return message.channel.send(embed);
    }
	
	//usage(>serverinfo) show serverinfo
    if(message.content.startsWith(prefix + "serverinfo")) {
        const serverLevel = ["None", "Low", "Medium", "High", "Max"];

        const embed = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setThumbnail(message.guild.iconURL())
        .addField(`Owner`, message.guild.owner.user.tag, true)
        .addField(`ID`, message.guild.id, true)
        .addField(`Members`, message.guild.memberCount, true)
        .addField(`Bots`, message.guild.members.cache.filter(mem => mem.user.bot === true).size, true)
        .addField(`Online`, message.guild.members.cache.filter(mem => mem.presence.status != "offline").size. true)
        .addField(`Roles`, message.guild.roles.size, true)
        .addField(`Verification Level`, serverLevel[message.guild.verificationLevel], true)
        .addField(`Creation Date`, moment.utc(message.guild.createdAt).format("dddd, MMMM Do, YYYY"), true)
        .addField(`Role List [${message.guild.roles.size - 1}]`, message.guild.roles.cache.map(r => r).join(" ").replace("@everone", " "))

        return message.channel.send(embed);
    }
	
	//usage(>serverrules) show serverrules and the command you wrote will be deleted.
    if(message.content.startsWith(prefix + "serverrules")) {
        message.delete();
        const embed = new Discord.MessageEmbed()
        .setTitle('Title')
        .setAuthor('Revealed by admin')
        .setColor('#ddf542')//color
        .setDescription('Description')
        .addFields(
            { name: 'first', value: '1. first rule.' },
            { name: 'second', value: '2. second rule.' },
            { name: 'third', value: '3. third rule.' },
            { name: 'fourth', value: '4. fourth rule.' },
            { name: 'fifth', value: '5. fifth rule' },
            { name: 'sixth', value: '6.sixth rule.' },
            { name: 'seventh', value: '7.seventh rule.' },
            { name: 'eighth', value: '8. eighth rule.' },
            { name: 'last', value: 'last rule.' }
        )

        message.channel.send(embed)
    }
	
	//usage(>botcommand) show bot commands.
    if(message.content.startsWith(prefix + "botcommand")) {
        message.delete();
        const embed = new Discord.MessageEmbed()
        .setTitle('A2MODEL command')
        .setAuthor('Revealed by admin')
        .setColor('#230bdb') //color
        .setDescription('Description')
        .addFields(
            { name: '>serverrules', value: 'info.' },
            { name: '>serverinfo', value: 'info.' },
            { name: '>userinfo [@멤버 이름]', value: 'info.' },
            { name: '>ping', value: 'info.' },
        )

        message.channel.send(embed)
    }

    
    

});

//usage(>report @Nickname reason) report member in the discord
client.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    var prefix = '>'
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    if(cmd === (prefix + "report")) {
        

        let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
        if(!rUser) return message.channel.send("Couldn't found that member!");
        let reason = args.join(" ").slice(22)

        let reportEmbed = new Discord.MessageEmbed()
        .setTitle("Member report")
        .setDescription("Reports")
        .setColor("#ff0000") //color
        .addField("Reported Member", `${rUser} with ID: ${rUser.id}`)
        .addField("Caller", `${message.author} with ID: ${message.author.id}`)
        .addField("Reported Room", message.channel)
        .addField("Time", message.createdAt)
        .addField("Reason", reason);

        let reportsChannel = message.guild.channels.cache.find(channel => channel.name === "Room name"); //Room where you want to set up the reported list
        if(!reportsChannel) return message.channel.send("we couldn't found that room!");

        message.delete().catch(O_o=>{});
        reportsChannel.send(reportEmbed);
    }
    
});

//Ban inapropriate words
client.on("message", async message => {
    let foundInText = false;
    for(var i in badwords) {
        if(message.content.toLowerCase().includes(badwords[i].toLowerCase())) foundInText = true;
    }

    if(foundInText) {
        message.delete();
        const embed = new Discord.MessageEmbed()
        .setColor('#57e038')
        .setDescription(`${message.author.username}, This message is deleted by administrator.`)

        message.channel.send(embed)
    }
});


client.login('Your Token')