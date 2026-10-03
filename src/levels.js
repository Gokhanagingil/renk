(function(root){
const levels=[
 {id:1,title:'İki kişi insin…',subtitle:'Açılan koltukları keşfet',cars:[[2,2],[0,4]],waiting:[2,0],tip:'Şimdi Sahil: şemsiyeli yolcular iner. A aracına dokun.'},
 {id:2,title:'Aynı araç, yeni yolcular',subtitle:'İki durak arasında düşün',cars:[[1,3],[3,1]],waiting:[4,2],tip:'İnen yolcu yer açar; bekleyen yolcu o yere biner.'},
 {id:3,title:'Boşluk değerlidir',subtitle:'Her koltuğun bir işi var',cars:[[0,4],[2,1]],waiting:[5,3],tip:'Dört dolu koltuk her zaman kötü değildir. Bu durakta kim inecek?'},
 {id:4,title:'Üç küçük minibüs',subtitle:'Bir hamle sonrasını gör',cars:[[2,2],[1,2],[3,0]],waiting:[4,4],tip:'Bir sonraki durağa hangi yolcularla gideceğini düşün.'},
 {id:5,title:'Tam değişim',subtitle:'Dolu gelsin, dolu gitsin',cars:[[4,0],[2,2],[0,3]],waiting:[6,5],tip:'Dört kişinin inip dört kişinin binmesi: tam değişim!'},
 {id:6,title:'Park dönüşü',subtitle:'Bu kez Park’tan başla',stop:1,cars:[[3,1],[2,2],[1,3]],waiting:[5,6],tip:'Ağaç simgesi Park, şemsiye Sahil. Araç rengi bir kural değil.'},
 {id:7,title:'Akşam servisi',subtitle:'Dört araç, tek iyi plan',cars:[[4,0],[3,1],[1,3],[0,4]],waiting:[7,7],tip:'Süre sınırı yok. Az seferle çok yolcu ulaştır.'},
 {id:8,title:'Son yolcu eve',subtitle:'Kasabanın durak ustası',stop:1,cars:[[2,2],[1,3],[3,1],[2,1]],waiting:[8,9],tip:'Bütün yolcuları ulaştır. Üç yıldız için seferlerini planla.'}
];
if(typeof module!=='undefined'&&module.exports)module.exports=levels;else root.RENK_LEVELS=levels;
})(typeof window!=='undefined'?window:globalThis);
