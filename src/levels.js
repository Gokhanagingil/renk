(function(root){const levels=[
  {
    "id": 1,
    "title": "Önce yolu aç",
    "tip": "İlk yolcu kırmızı. Kırmızı aracın önündeki maviyi çıkar.",
    "size": 6,
    "cars": [
      {
        "id": 0,
        "x": 1,
        "y": 0,
        "w": 1,
        "h": 2,
        "dir": "N",
        "color": 1,
        "capacity": 2
      },
      {
        "id": 1,
        "x": 1,
        "y": 3,
        "w": 1,
        "h": 2,
        "dir": "N",
        "color": 0,
        "capacity": 2
      },
      {
        "id": 2,
        "x": 3,
        "y": 0,
        "w": 1,
        "h": 2,
        "dir": "N",
        "color": 2,
        "capacity": 2
      },
      {
        "id": 3,
        "x": 5,
        "y": 3,
        "w": 1,
        "h": 2,
        "dir": "N",
        "color": 2,
        "capacity": 2
      }
    ],
    "queue": [
      0,
      0,
      1,
      1,
      2,
      2,
      2,
      2
    ]
  },
  {
    "id": 2,
    "title": "Üç yer, tek plan",
    "tip": "Çıkabilen her aracı göndermek iyi fikir olmayabilir.",
    "size": 6,
    "cars": [
      {
        "id": 0,
        "x": 0,
        "y": 0,
        "w": 1,
        "h": 2,
        "dir": "N",
        "color": 1,
        "capacity": 2
      },
      {
        "id": 1,
        "x": 0,
        "y": 3,
        "w": 1,
        "h": 2,
        "dir": "N",
        "color": 0,
        "capacity": 2
      },
      {
        "id": 2,
        "x": 2,
        "y": 1,
        "w": 2,
        "h": 1,
        "dir": "E",
        "color": 2,
        "capacity": 2
      },
      {
        "id": 3,
        "x": 4,
        "y": 0,
        "w": 1,
        "h": 2,
        "dir": "N",
        "color": 1,
        "capacity": 2
      },
      {
        "id": 4,
        "x": 3,
        "y": 4,
        "w": 2,
        "h": 1,
        "dir": "W",
        "color": 0,
        "capacity": 2
      },
      {
        "id": 5,
        "x": 2,
        "y": 2,
        "w": 1,
        "h": 2,
        "dir": "S",
        "color": 2,
        "capacity": 2
      }
    ],
    "queue": [
      0,
      0,
      2,
      2,
      1,
      1,
      0,
      0,
      2,
      2,
      1,
      1
    ]
  },
  {
    "id": 3,
    "title": "Yarım dolu",
    "tip": "Araç dolmadan ayrılmaz. Yolcu sırası önemli.",
    "size": 6,
    "cars": [
      {
        "id": 0,
        "x": 3,
        "y": 1,
        "w": 2,
        "h": 1,
        "dir": "E",
        "color": 0,
        "capacity": 2
      },
      {
        "id": 1,
        "x": 0,
        "y": 2,
        "w": 1,
        "h": 2,
        "dir": "S",
        "color": 1,
        "capacity": 2
      },
      {
        "id": 2,
        "x": 1,
        "y": 1,
        "w": 1,
        "h": 2,
        "dir": "N",
        "color": 2,
        "capacity": 2
      },
      {
        "id": 3,
        "x": 3,
        "y": 3,
        "w": 2,
        "h": 1,
        "dir": "W",
        "color": 0,
        "capacity": 2
      },
      {
        "id": 4,
        "x": 5,
        "y": 1,
        "w": 1,
        "h": 2,
        "dir": "N",
        "color": 1,
        "capacity": 2
      },
      {
        "id": 5,
        "x": 1,
        "y": 0,
        "w": 2,
        "h": 1,
        "dir": "W",
        "color": 2,
        "capacity": 2
      }
    ],
    "queue": [
      0,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      2,
      2,
      2,
      2
    ]
  },
  {
    "id": 4,
    "title": "Dar sokak",
    "tip": "Yön oklarını izle; hangi araç hangisini engelliyor?",
    "size": 6,
    "cars": [
      {
        "id": 0,
        "x": 5,
        "y": 0,
        "w": 1,
        "h": 2,
        "dir": "S",
        "color": 0,
        "capacity": 2
      },
      {
        "id": 1,
        "x": 2,
        "y": 4,
        "w": 1,
        "h": 2,
        "dir": "S",
        "color": 1,
        "capacity": 2
      },
      {
        "id": 2,
        "x": 4,
        "y": 2,
        "w": 2,
        "h": 1,
        "dir": "E",
        "color": 2,
        "capacity": 2
      },
      {
        "id": 3,
        "x": 3,
        "y": 4,
        "w": 2,
        "h": 1,
        "dir": "W",
        "color": 0,
        "capacity": 2
      },
      {
        "id": 4,
        "x": 3,
        "y": 2,
        "w": 1,
        "h": 2,
        "dir": "S",
        "color": 1,
        "capacity": 2
      },
      {
        "id": 5,
        "x": 0,
        "y": 0,
        "w": 2,
        "h": 1,
        "dir": "W",
        "color": 2,
        "capacity": 2
      }
    ],
    "queue": [
      0,
      2,
      2,
      0,
      2,
      2,
      1,
      1,
      1,
      1,
      0,
      0
    ]
  },
  {
    "id": 5,
    "title": "İki hamle sonrası",
    "tip": "İhtiyacın olan aracın önünü, durakta yer bırakarak aç.",
    "size": 6,
    "cars": [
      {
        "id": 0,
        "x": 1,
        "y": 1,
        "w": 1,
        "h": 2,
        "dir": "S",
        "color": 0,
        "capacity": 3
      },
      {
        "id": 1,
        "x": 5,
        "y": 2,
        "w": 1,
        "h": 2,
        "dir": "N",
        "color": 1,
        "capacity": 2
      },
      {
        "id": 2,
        "x": 3,
        "y": 0,
        "w": 2,
        "h": 1,
        "dir": "E",
        "color": 2,
        "capacity": 2
      },
      {
        "id": 3,
        "x": 2,
        "y": 2,
        "w": 1,
        "h": 2,
        "dir": "S",
        "color": 0,
        "capacity": 2
      },
      {
        "id": 4,
        "x": 0,
        "y": 0,
        "w": 2,
        "h": 1,
        "dir": "W",
        "color": 1,
        "capacity": 2
      },
      {
        "id": 5,
        "x": 1,
        "y": 4,
        "w": 2,
        "h": 1,
        "dir": "E",
        "color": 2,
        "capacity": 3
      },
      {
        "id": 6,
        "x": 3,
        "y": 4,
        "w": 1,
        "h": 2,
        "dir": "N",
        "color": 0,
        "capacity": 2
      }
    ],
    "queue": [
      0,
      0,
      2,
      2,
      1,
      1,
      1,
      1,
      0,
      2,
      2,
      2,
      0,
      0,
      0,
      0
    ]
  },
  {
    "id": 6,
    "title": "Sabırlı kırmızı",
    "tip": "Sıranın tamamını göz düğmesinden görebilirsin.",
    "size": 6,
    "cars": [
      {
        "id": 0,
        "x": 3,
        "y": 0,
        "w": 1,
        "h": 2,
        "dir": "N",
        "color": 0,
        "capacity": 2
      },
      {
        "id": 1,
        "x": 4,
        "y": 2,
        "w": 2,
        "h": 1,
        "dir": "W",
        "color": 1,
        "capacity": 2
      },
      {
        "id": 2,
        "x": 2,
        "y": 2,
        "w": 1,
        "h": 2,
        "dir": "S",
        "color": 2,
        "capacity": 2
      },
      {
        "id": 3,
        "x": 0,
        "y": 0,
        "w": 2,
        "h": 1,
        "dir": "E",
        "color": 0,
        "capacity": 2
      },
      {
        "id": 4,
        "x": 2,
        "y": 4,
        "w": 1,
        "h": 2,
        "dir": "S",
        "color": 1,
        "capacity": 2
      },
      {
        "id": 5,
        "x": 0,
        "y": 1,
        "w": 2,
        "h": 1,
        "dir": "E",
        "color": 2,
        "capacity": 2
      },
      {
        "id": 6,
        "x": 3,
        "y": 5,
        "w": 2,
        "h": 1,
        "dir": "W",
        "color": 0,
        "capacity": 2
      }
    ],
    "queue": [
      2,
      2,
      1,
      1,
      1,
      1,
      0,
      0,
      2,
      0,
      2,
      0,
      0,
      0
    ]
  },
  {
    "id": 7,
    "title": "Minibüs saati",
    "tip": "Uzun aracın dört koltuğu var. Dolmasını planla.",
    "size": 6,
    "cars": [
      {
        "id": 0,
        "x": 3,
        "y": 5,
        "w": 2,
        "h": 1,
        "dir": "W",
        "color": 0,
        "capacity": 2
      },
      {
        "id": 1,
        "x": 4,
        "y": 4,
        "w": 2,
        "h": 1,
        "dir": "W",
        "color": 1,
        "capacity": 2
      },
      {
        "id": 2,
        "x": 2,
        "y": 2,
        "w": 1,
        "h": 2,
        "dir": "S",
        "color": 2,
        "capacity": 2
      },
      {
        "id": 3,
        "x": 0,
        "y": 2,
        "w": 1,
        "h": 2,
        "dir": "N",
        "color": 0,
        "capacity": 3
      },
      {
        "id": 4,
        "x": 1,
        "y": 1,
        "w": 2,
        "h": 1,
        "dir": "W",
        "color": 1,
        "capacity": 2
      },
      {
        "id": 5,
        "x": 4,
        "y": 1,
        "w": 2,
        "h": 1,
        "dir": "W",
        "color": 2,
        "capacity": 2
      },
      {
        "id": 6,
        "x": 0,
        "y": 5,
        "w": 3,
        "h": 1,
        "dir": "W",
        "color": 0,
        "capacity": 4
      },
      {
        "id": 7,
        "x": 3,
        "y": 3,
        "w": 1,
        "h": 2,
        "dir": "N",
        "color": 1,
        "capacity": 2
      }
    ],
    "queue": [
      2,
      1,
      2,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      2,
      2,
      1,
      1,
      0,
      1,
      1,
      0
    ]
  },
  {
    "id": 8,
    "title": "Bir yer kalsın",
    "tip": "Üç yeri birden yanlış renklerle doldurma.",
    "size": 6,
    "cars": [
      {
        "id": 0,
        "x": 3,
        "y": 4,
        "w": 1,
        "h": 2,
        "dir": "S",
        "color": 0,
        "capacity": 2
      },
      {
        "id": 1,
        "x": 1,
        "y": 3,
        "w": 3,
        "h": 1,
        "dir": "E",
        "color": 1,
        "capacity": 4
      },
      {
        "id": 2,
        "x": 0,
        "y": 2,
        "w": 2,
        "h": 1,
        "dir": "E",
        "color": 2,
        "capacity": 2
      },
      {
        "id": 3,
        "x": 1,
        "y": 0,
        "w": 3,
        "h": 1,
        "dir": "W",
        "color": 0,
        "capacity": 4
      },
      {
        "id": 4,
        "x": 4,
        "y": 2,
        "w": 2,
        "h": 1,
        "dir": "E",
        "color": 1,
        "capacity": 2
      },
      {
        "id": 5,
        "x": 0,
        "y": 3,
        "w": 1,
        "h": 2,
        "dir": "N",
        "color": 2,
        "capacity": 3
      },
      {
        "id": 6,
        "x": 4,
        "y": 1,
        "w": 2,
        "h": 1,
        "dir": "W",
        "color": 0,
        "capacity": 2
      },
      {
        "id": 7,
        "x": 5,
        "y": 3,
        "w": 1,
        "h": 3,
        "dir": "N",
        "color": 1,
        "capacity": 4
      }
    ],
    "queue": [
      0,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      1,
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      2,
      2,
      2,
      2,
      2,
      0,
      0
    ]
  },
  {
    "id": 9,
    "title": "Dördüncü renk",
    "tip": "Yeni renk: mor. Şekiller renkleri ayırt etmene yardım eder.",
    "size": 6,
    "cars": [
      {
        "id": 0,
        "x": 1,
        "y": 0,
        "w": 1,
        "h": 2,
        "dir": "N",
        "color": 0,
        "capacity": 2
      },
      {
        "id": 1,
        "x": 1,
        "y": 2,
        "w": 1,
        "h": 2,
        "dir": "S",
        "color": 1,
        "capacity": 3
      },
      {
        "id": 2,
        "x": 2,
        "y": 0,
        "w": 1,
        "h": 2,
        "dir": "N",
        "color": 2,
        "capacity": 2
      },
      {
        "id": 3,
        "x": 2,
        "y": 5,
        "w": 2,
        "h": 1,
        "dir": "W",
        "color": 3,
        "capacity": 3
      },
      {
        "id": 4,
        "x": 3,
        "y": 1,
        "w": 2,
        "h": 1,
        "dir": "W",
        "color": 0,
        "capacity": 2
      },
      {
        "id": 5,
        "x": 0,
        "y": 3,
        "w": 1,
        "h": 2,
        "dir": "N",
        "color": 1,
        "capacity": 2
      },
      {
        "id": 6,
        "x": 3,
        "y": 2,
        "w": 2,
        "h": 1,
        "dir": "W",
        "color": 2,
        "capacity": 2
      },
      {
        "id": 7,
        "x": 2,
        "y": 4,
        "w": 2,
        "h": 1,
        "dir": "W",
        "color": 3,
        "capacity": 2
      },
      {
        "id": 8,
        "x": 2,
        "y": 2,
        "w": 1,
        "h": 2,
        "dir": "N",
        "color": 0,
        "capacity": 2
      }
    ],
    "queue": [
      3,
      3,
      3,
      1,
      1,
      1,
      0,
      1,
      0,
      1,
      3,
      3,
      2,
      2,
      0,
      0,
      2,
      2,
      0,
      0
    ]
  },
  {
    "id": 10,
    "title": "Düğümü çöz",
    "tip": "Öndeki aracı çıkarmak bazen iki yol birden açar.",
    "size": 6,
    "cars": [
      {
        "id": 0,
        "x": 0,
        "y": 2,
        "w": 1,
        "h": 3,
        "dir": "N",
        "color": 0,
        "capacity": 4
      },
      {
        "id": 1,
        "x": 5,
        "y": 1,
        "w": 1,
        "h": 2,
        "dir": "N",
        "color": 1,
        "capacity": 2
      },
      {
        "id": 2,
        "x": 2,
        "y": 4,
        "w": 1,
        "h": 2,
        "dir": "S",
        "color": 2,
        "capacity": 3
      },
      {
        "id": 3,
        "x": 2,
        "y": 2,
        "w": 2,
        "h": 1,
        "dir": "E",
        "color": 3,
        "capacity": 2
      },
      {
        "id": 4,
        "x": 1,
        "y": 0,
        "w": 2,
        "h": 1,
        "dir": "E",
        "color": 0,
        "capacity": 2
      },
      {
        "id": 5,
        "x": 1,
        "y": 1,
        "w": 1,
        "h": 2,
        "dir": "S",
        "color": 1,
        "capacity": 2
      },
      {
        "id": 6,
        "x": 3,
        "y": 4,
        "w": 2,
        "h": 1,
        "dir": "W",
        "color": 2,
        "capacity": 2
      },
      {
        "id": 7,
        "x": 5,
        "y": 3,
        "w": 1,
        "h": 2,
        "dir": "S",
        "color": 3,
        "capacity": 2
      },
      {
        "id": 8,
        "x": 1,
        "y": 3,
        "w": 3,
        "h": 1,
        "dir": "E",
        "color": 0,
        "capacity": 4
      }
    ],
    "queue": [
      3,
      2,
      3,
      2,
      2,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      3,
      0,
      0,
      3,
      0,
      0,
      2,
      2
    ]
  },
  {
    "id": 11,
    "title": "Son çıkış",
    "tip": "Takılırsan geri al. Aynı düzen üzerinde yeni plan kur.",
    "size": 6,
    "cars": [
      {
        "id": 0,
        "x": 3,
        "y": 2,
        "w": 1,
        "h": 2,
        "dir": "N",
        "color": 0,
        "capacity": 2
      },
      {
        "id": 1,
        "x": 0,
        "y": 4,
        "w": 1,
        "h": 2,
        "dir": "S",
        "color": 1,
        "capacity": 2
      },
      {
        "id": 2,
        "x": 3,
        "y": 1,
        "w": 2,
        "h": 1,
        "dir": "E",
        "color": 2,
        "capacity": 2
      },
      {
        "id": 3,
        "x": 2,
        "y": 0,
        "w": 2,
        "h": 1,
        "dir": "E",
        "color": 3,
        "capacity": 2
      },
      {
        "id": 4,
        "x": 4,
        "y": 2,
        "w": 2,
        "h": 1,
        "dir": "W",
        "color": 0,
        "capacity": 2
      },
      {
        "id": 5,
        "x": 1,
        "y": 3,
        "w": 1,
        "h": 2,
        "dir": "N",
        "color": 1,
        "capacity": 3
      },
      {
        "id": 6,
        "x": 3,
        "y": 4,
        "w": 1,
        "h": 2,
        "dir": "S",
        "color": 2,
        "capacity": 2
      },
      {
        "id": 7,
        "x": 4,
        "y": 0,
        "w": 2,
        "h": 1,
        "dir": "E",
        "color": 3,
        "capacity": 2
      },
      {
        "id": 8,
        "x": 1,
        "y": 1,
        "w": 2,
        "h": 1,
        "dir": "W",
        "color": 0,
        "capacity": 2
      },
      {
        "id": 9,
        "x": 5,
        "y": 4,
        "w": 1,
        "h": 2,
        "dir": "S",
        "color": 1,
        "capacity": 2
      }
    ],
    "queue": [
      2,
      0,
      2,
      0,
      1,
      1,
      2,
      2,
      1,
      1,
      3,
      3,
      3,
      0,
      0,
      3,
      1,
      1,
      1,
      0,
      0
    ]
  },
  {
    "id": 12,
    "title": "Park ustası",
    "tip": "Süre sınırı yok. Parkın tamamını çöz.",
    "size": 6,
    "cars": [
      {
        "id": 0,
        "x": 1,
        "y": 3,
        "w": 2,
        "h": 1,
        "dir": "E",
        "color": 0,
        "capacity": 2
      },
      {
        "id": 1,
        "x": 5,
        "y": 2,
        "w": 1,
        "h": 2,
        "dir": "S",
        "color": 1,
        "capacity": 2
      },
      {
        "id": 2,
        "x": 2,
        "y": 2,
        "w": 2,
        "h": 1,
        "dir": "W",
        "color": 2,
        "capacity": 2
      },
      {
        "id": 3,
        "x": 0,
        "y": 4,
        "w": 2,
        "h": 1,
        "dir": "E",
        "color": 3,
        "capacity": 3
      },
      {
        "id": 4,
        "x": 2,
        "y": 0,
        "w": 2,
        "h": 1,
        "dir": "W",
        "color": 0,
        "capacity": 2
      },
      {
        "id": 5,
        "x": 4,
        "y": 0,
        "w": 2,
        "h": 1,
        "dir": "E",
        "color": 1,
        "capacity": 2
      },
      {
        "id": 6,
        "x": 0,
        "y": 1,
        "w": 1,
        "h": 2,
        "dir": "S",
        "color": 2,
        "capacity": 2
      },
      {
        "id": 7,
        "x": 4,
        "y": 1,
        "w": 2,
        "h": 1,
        "dir": "E",
        "color": 3,
        "capacity": 2
      },
      {
        "id": 8,
        "x": 2,
        "y": 5,
        "w": 2,
        "h": 1,
        "dir": "W",
        "color": 0,
        "capacity": 3
      },
      {
        "id": 9,
        "x": 0,
        "y": 0,
        "w": 2,
        "h": 1,
        "dir": "W",
        "color": 1,
        "capacity": 2
      }
    ],
    "queue": [
      3,
      3,
      3,
      3,
      3,
      1,
      1,
      1,
      1,
      2,
      0,
      0,
      2,
      2,
      2,
      1,
      1,
      0,
      0,
      0,
      0,
      0
    ]
  }
];if(typeof module!=='undefined'&&module.exports)module.exports=levels;else root.PARKING_LEVELS=levels;})(typeof window!=='undefined'?window:globalThis);
