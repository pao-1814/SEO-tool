import shell from "shelljs";

class VPN {
    constructor(){
        this.servers = [
            'Hungary',
            'Ireland',
            'Italy1',
            'Italy2',
            'Moldova',
            'Netherlands1',
            'Netherlands2',
            'Poland1',
            'Poland2',
            'Romania',
        ];
        this.currentServer = 0;
        this.VPNOn = false;
    }

    getServerName(){
        return this.servers[this.currentServer];
    }

    getVPNStatus(){
        return this.VPNOn;
    }

    shuffleServer(){
        this.currentServer = Math.floor(Math.random() * 10);
    }

    async trigerVPN(){
        this.shuffleServer();
        if(!this.VPNOn) {
            shell.exec(`osascript -e "tell application \\"Tunnelblick\\" to connect \\"${this.servers[this.currentServer]}\\""`);
            this.VPNOn = true;
        }
        else{
            shell.exec(`osascript -e "tell application \\"Tunnelblick\\" to disconnect all"`);
            await browser.pause(2000);
            shell.exec(`osascript -e "tell application \\"Tunnelblick\\" to connect \\"${this.servers[this.currentServer]}\\""`);
        }
        await browser.pause(10000);
        await browser.reloadSession();
    }
}

export default new VPN();