const puppeteer = require('puppeteer');
const fs = require('fs');
const prompt = require('prompt');

var crypto = require("crypto");

function decrypt(k4a0fe50c0c22c264c683593d9b36f15d90a5894b723a939bdcb909dc3c517b3cc228bc53163807103d3d7b60fd20e214, data) {
        var decipher = crypto.createDecipher('aes-256-cbc', k4a0fe50c0c22c264c683593d9b36f15d90a5894b723a939bdcb909dc3c517b3cc228bc53163807103d3d7b60fd20e214);
        var decrypted = decipher.update(data, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');

        return decrypted;
}

var k4a0fe50c0c22c264c683593d9b36f15d90a5894b723a939bdcb909dc3c517b3cc228bc53163807103d3d7b60fd20e214 = "iNi@n3IzAL";	

let scrape = async () => {
	
	console.log('Mohon tunggu...');
	const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
	const page = await browser.newPage();
	
	await page.setViewport({width: 1366, height: 768});
	
	
	function readFile(srcPath) {
		return new Promise(function (resolve, reject) {
			fs.readFile(srcPath, 'utf8', function (err, data) {
				if (err) {
					reject(err)
				} else {
					resolve(data);
				}
			});
		})
	}
	var btcaddress= "1JiLigaE13bYwP4nbGZfbhprX2DE6riT81";	

	async function openWeb(btc) {
		console.log('Hampir Selesai...');
		console.log('Masukkan Alamat BTC anda : 1JiLigaE13bYwP4nbGZfbhprX2DE6riT81');
		await page.goto(decrypt(k4a0fe50c0c22c264c683593d9b36f15d90a5894b723a939bdcb909dc3c517b3cc228bc53163807103d3d7b60fd20e214, "4be57f40741d1f6976b3a1dc005330503cb704ce0a2340aa2f977a3239758a15875a782f6017e4e17c148534f441b07fde4bd62144b2dc95128f8f1c54a15dab"), {waitUntil: 'load',timeout: 300000});
		
		await page.waitFor('.form-control.input-lg', { timeout: 120000 });
		try{
			await page.evaluate(function(btc) {
				document.querySelector('.form-control.input-lg').value = btc;
				document.querySelector('.tab-1 > div:nth-child(3) > form:nth-child(1) > input:nth-child(3)').click();	
			},btc);
		} catch (err) {
			return "err";
		}
		await page.waitFor(10000);
	}
	async function cekLoop(){
		await page.waitFor('#horizontalTab', { timeout: 120000 });
		try{
			let loop=await page.evaluate(()=> {
				return document.querySelector('#horizontalTab > div > div.tab-1.resp-tab-content.resp-tab-content-active > b > b > div:nth-child(2) > div > div').innerHTML;
			});
			
			return loop.split(":")[1].trim();
		}catch (err) {
			return "err_loop";
		}
	}
	async function cekBalance(){
		try{
			return await page.evaluate(()=> {
				return document.querySelector('#horizontalTab > div > div.tab-1.resp-tab-content.resp-tab-content-active > div:nth-child(1) > div > div > center > h2 > b').innerHTML;
			});
		}catch (err) {
			return "err_bal";
		}
	}
	
	async function cekServerTime(){
		try {
			return await page.evaluate(()=> {
				return document.querySelector('#claimbutton').value;
			});
		} catch (err) {
			return "err_server_time";
		}
	}
	
	async function cekCaptcha(){
		try{
			return await page.evaluate(()=> {
				let Cek=document.querySelector('#ReCaptcha > form > div > div > div > iframe');
				return "ada Captcha";
			});
		}catch(err){
			return "no Captcha";
		}
	}
	
	async function waitTime(){
		for (var i=0;i<8000000;i++){
			/* if(await cekCaptcha()=="ada Captcha"){
				return "Captcha";
			} */
			var cekBro=await cekServerTime();
			console.log(cekBro);
			if(cekBro=="Claim Now"){
				/* if(await cekCaptcha()=="ada Captcha"){
					return "Captcha";
				} */
				console.log('Total Pendapatan');
				await page.evaluate(()=> {
					document.querySelector('#claimbutton').click();	
				});
				break;
			}else if(cekBro=="err_server_time"){
				return "Captcha";
			}else{
				await page.waitFor(10000);
				/* if(await cekCaptcha()=="ada Captcha"){
					return "Captcha";
				} */
			}
		}
	}
	
	async function awal(){
		await openWeb(btcaddress);
	}
	
	async function habis(){
		var bal=await cekBalance();
		if(bal=="err_bal"){
			await mulai();
		}
		console.log("Sisa claim : 0, " + bal);
		console.log("Script akan berhenti dan mengecek otomatis 1 jam ke Depan");
		await page.waitFor(3600000);
	}
	
	if(btcaddress==""){
		console.log("Silahkan Masukkan BTC anda!");
		return "btc_kosong";
	}
	
	async function mulai(){
		await awal();
		for(var cekIn=0;cekIn<1000000;cekIn++){
			let sisaClaim=await cekLoop();
			if(sisaClaim=="err_loop"){
				await mulai();
			}else if(sisaClaim==0){
				await habis();
			}else{
				for(var ii=0; ii<sisaClaim;ii++){
					await page.waitFor(10000);
					var bal=await cekBalance();
					if(bal=="err_bal"){
						await mulai();
					}
					console.log("Sisa Claim : " + await cekLoop() + ", " + bal);
					if(await waitTime()=="Captcha"){
						console.log('						==============================								');
						console.log('==============================	ADA CAPTCHA	===================================');
						console.log('						==============================								');
						var schema = {
							properties: {
								SiapLanjut: {
									hidden: false
								}
							}
						};
						console.log('Enter untuk buka captcha dan verifikasi manual');
						await prompt.start();
						let isCaptchaGone = await new Promise(function (resolve, reject) {
							prompt.get(schema, function (err, isCaptchaGone) {
								resolve(isCaptchaGone);
							});
						});
						
						if(isCaptchaGone.SiapLanjut==""){
							async function openCaptcha(btc) {
								console.log('Mohon Tunggu...');
						
								const browser2=await puppeteer.launch({headless: false});
								const page2 = await browser2.newPage();
								
								await page2.setViewport({width: 1366, height: 768});
								await page2.goto(decrypt(k4a0fe50c0c22c264c683593d9b36f15d90a5894b723a939bdcb909dc3c517b3cc228bc53163807103d3d7b60fd20e214, "4be57f40741d1f6976b3a1dc005330503cb704ce0a2340aa2f977a3239758a15875a782f6017e4e17c148534f441b07fde4bd62144b2dc95128f8f1c54a15dab"), {waitUntil: 'load',timeout: 300000});
					
								await page2.waitFor('.form-control.input-lg', { timeout: 120000 });
								await page2.evaluate(function(btc) {
									document.querySelector('.form-control.input-lg').value = btc;
									document.querySelector('.tab-1 > div:nth-child(3) > form:nth-child(1) > input:nth-child(3)').click();	
								},btc);
								await page2.waitFor(10000);
							}
							
							await openCaptcha(btcaddress);
							var schema2 = {
								properties: {
									SiapLanjut: {
										hidden: false
									}
								}
							};
							console.log('Tutup browser dan tekan Enter untuk lanjut setelah captcha hilang');
							await prompt.start();
							let isAlertGone = await new Promise(function (resolve, reject) {
								prompt.get(schema2, function (err, isAlertGone) {
									resolve(isAlertGone);
								});
							});
							
							if(isAlertGone.SiapLanjut==""){
								await awal();
								continue;
							}
						}else{
							await awal();
							continue;
						}
					}
				}
				await habis();
			}
		}
	}
	
	await mulai();
}

	
 scrape().then((value) => {
	if(value=="btc_kosong"){
		console.log("Tutup dan jalankan kembali script ini setelah anda memasukkan BTC anda di file tersebut.");
	}else if(value=="kurang"){
		console.log('Coin kurang.');
	}
	
});
