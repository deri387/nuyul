const puppeteer = require('puppeteer');

(async() => {
const browser = await puppeteer.launch({headless: true,args: ['--no-sandbox', '--disable-setuid-sandbox']});
const page = await browser.newPage();
await page.goto('http://floodcoins.xyz/faucet.php?address=DJ8T7fdA3PTWVXXE8YFFcqbkmYsHfFSwQu&currency=DOGE&key=caed9e6172e840e025e26e9127435671');
console.log("Website berhasil terbuka!");
console.log("Biarkan terminal tetap berjalan...");
})();
