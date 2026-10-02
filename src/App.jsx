import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import './index.css';

/* KULLANICI ÖZEL MESAJI BURAYA GELECEK */
const romanticMessage = `Hayat'ım,

Bir aydır günümün büyük bir çoğunluğunu seninle olan geleceğimin hayalini kurarak geçiriyorum ve bu bana hayatımda sen yokken ne kadar az
hayal kurduğumu fark ettirdi. Aslında küçüklüğümden beri en sevdiğim şey her zaman hayal kurmak, olmayan şeyleri düşünmek ve yalnız kaldığım 
zamanlarda kendimi o gerçekliğe hapsetmekti. Yaşım ilerledikçe bu hayal dünyam ve oradaki her nesne bana yavaş yavaş elveda demeye başlamıştı ta ki seninle tanışana kadar. Aslında uzun süredir kayıpmışım da sadece farkında değilmişim. Senin perspektifinde bencilce olan ve asla cesaret edemediğimiz ilişki yolu aslında beni bu labirentten çıkartabilecek tek haritaymış. Açgözlü biri olduğumu düşünmüyorum ama bana her zaman şükretmek saçma ve bir kaçış yolu olarak gelirdi. Şu an seninle olduğum için evrene teşekkür etmediğim tek bir gün yok (büyük konuşmamak lazımmış). Dünyanın en güzel, çevremdeki en komik ve tanıdığım en zeki kızsın ve sana tahmin ettiğinden çok daha fazla saygı duyuyorum ki benim için en önemlisi her zaman bu olacak.

İyi ki varsın sevgilim, birinci ayımız kutlu olsun...`;

const mediaFiles = [
  "1-.jpeg",
  "2-.jpeg",
  "3-.jpeg",
  "4-.jpeg",
  "5-.jpeg",
  "6-.jpeg",
  "7-.jpeg",
  "8-.jpeg",
  "9-.jpeg",
  "10-.jpeg",
  "11-.jpeg",
  "12-.jpeg",
  "13-.jpeg",
  "14-.jpeg",
  "15-.jpeg",
  "16-.mp4"
];

const mediaItems = mediaFiles.map((filename, i) => {
  const isVideo = filename.endsWith('.mp4') || filename.endsWith('.webm');
  return {
    id: i + 1,
    type: isVideo ? 'video' : 'image',
    src: `/görseller/${filename}`
  };
});

const songList = [
  { title: "Dress", src: "/Şarkılar/Dress.mpeg" },
  { title: "Lil Peep - big city blues", src: "/Şarkılar/Lil Peep - big city blues (feat. cold hart).mpeg" },
  { title: "Sienna Spiro - Great Expectation", src: "/Şarkılar/SIENNA SPIRO - Great Expectation.mp3" }
];

export default function App() {
  const [phase, setPhase] = useState(1); // 1: Hero, 2: Gallery, 3: Message
  const [galleryIndex, setGalleryIndex] = useState(0);
  
  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Autoplay engellendi:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex]);

  const startJourney = () => {
    setIsPlaying(true);
    setGalleryIndex(0);
    setPhase(2);
  };

  const handleNext = () => {
    if (galleryIndex < mediaItems.length - 1) {
      setGalleryIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (galleryIndex > 0) {
      setGalleryIndex(prev => prev - 1);
    } else {
      setPhase(1); // Geri dönmek isterse Hero sayfasına
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const changeSong = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="grain-overlay"></div>
      
      {/* Audio Element */}
      <audio 
        ref={audioRef} 
        src={songList[currentSongIndex].src} 
        loop 
      />

      {/* Müzik Kontrol Paneli */}
      <div style={{
        position: 'fixed',
        top: '30px',
        right: '40px',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button onClick={togglePlay} style={styles.playCircle}>
            {isPlaying ? <Pause size={18} fill="#4A3B3F" color="#4A3B3F" /> : <Play size={18} fill="#4A3B3F" color="#4A3B3F" style={{marginLeft: '2px'}} />}
          </button>
          <div style={{color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center'}}>
            <Volume2 size={20} />
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={styles.switchButton}>
            SWITCH TRACKS
          </button>
        </div>
        
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              style={styles.popover}
            >
              {songList.map((song, idx) => (
                <div 
                  key={idx} 
                  onClick={() => changeSong(idx)}
                  style={{
                    ...styles.songItem,
                    opacity: currentSongIndex === idx ? 1 : 0.7,
                    fontWeight: currentSongIndex === idx ? '500' : '400'
                  }}
                >
                  {currentSongIndex === idx && <span style={styles.activeDot}></span>}
                  <span style={{ marginLeft: currentSongIndex === idx ? '0' : '15px' }}>
                    {song.title}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={styles.container}>
        <AnimatePresence mode="wait">
          {/* AŞAMA 1: GİRİŞ */}
          {phase === 1 && (
            <motion.div 
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={styles.hero}
            >
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                style={styles.title}
              >
                Beş Yıldır Hayalini Kurduğum Bir Ay.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
                style={styles.subtitle}
              >
                ve hayalini kurduğumuz diğer yıllara...
              </motion.p>
              
              <motion.button 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 1 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)', boxShadow: '0 0 40px rgba(255,255,255,0.8), inset 0 0 15px rgba(255,255,255,0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={startJourney}
                style={styles.button}
              >
                Kaderleri birleştir &lt;3
              </motion.button>
            </motion.div>
          )}

          {/* AŞAMA 2: GALERİ */}
          {phase === 2 && (
            <motion.div 
              key="gallery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              style={styles.galleryContainer}
            >
              <div style={styles.galleryWrapper}>
                <motion.button 
                  onClick={handlePrev} 
                  style={styles.navButton}
                  whileHover={{ scale: 1.1, color: '#fff' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft size={40} />
                </motion.button>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '25px', width: '100%' }}>
                  <motion.div className="media-frame" layout transition={{ duration: 0.5 }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={galleryIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="media-content"
                      >
                        {mediaItems[galleryIndex].type === 'video' ? (
                          <video 
                            src={mediaItems[galleryIndex].src} 
                            loop 
                            playsInline 
                            muted 
                            autoPlay
                            className="media-element"
                          />
                        ) : (
                          <img 
                            src={mediaItems[galleryIndex].src} 
                            alt="Anı" 
                            className="media-element"
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                    <div style={styles.counter}>{galleryIndex + 1} / {mediaItems.length}</div>
                  </motion.div>

                  <AnimatePresence>
                    {galleryIndex === mediaItems.length - 1 && (
                      <motion.button
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.8 }}
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)', boxShadow: '0 0 40px rgba(255,255,255,0.8), inset 0 0 15px rgba(255,255,255,0.3)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPhase(3)}
                        style={styles.button}
                      >
                        bide son olarak!
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {galleryIndex < mediaItems.length - 1 ? (
                  <motion.button 
                    onClick={handleNext} 
                    style={styles.navButton}
                    whileHover={{ scale: 1.1, color: '#fff' }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight size={40} />
                  </motion.button>
                ) : (
                  <div style={{ width: '60px' }}></div>
                )}
              </div>
            </motion.div>
          )}

          {/* AŞAMA 3: ÖZEL MESAJ */}
          {phase === 3 && (
            <motion.div 
              key="message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              style={styles.messageContainer}
            >
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1.2 }}
                style={styles.letter}
              >
                {romanticMessage.split('\n').map((line, idx) => (
                  <p key={idx} style={styles.messageLine}>{line}</p>
                ))}
              </motion.div>
              <motion.button 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)', boxShadow: '0 0 40px rgba(255,255,255,0.8), inset 0 0 15px rgba(255,255,255,0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPhase(1)}
                style={{...styles.button, marginTop: '40px'}}
              >
                Başa Dön
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

const styles = {
  container: {
    width: '100vw',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: '20px'
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: '800px',
    zIndex: 10
  },
  title: {
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    fontWeight: 300,
    marginBottom: '1rem',
    letterSpacing: '1px'
  },
  subtitle: {
    fontSize: 'clamp(1.2rem, 3vw, 2rem)',
    fontWeight: 300,
    fontStyle: 'italic',
    marginBottom: '3rem',
    opacity: 0.9
  },
  button: {
    padding: '12px 32px',
    fontSize: '1.2rem',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    borderRadius: '9999px',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(5px)',
    boxShadow: '0 0 20px rgba(255,255,255,0.5), inset 0 0 10px rgba(255,255,255,0.2)',
    color: '#FAF6F0',
    backgroundColor: 'rgba(255,255,255,0.05)'
  },
  playCircle: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF6F0',
    borderRadius: '50%',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease',
  },
  switchButton: {
    padding: '6px 16px',
    fontSize: '0.8rem',
    fontWeight: '600',
    letterSpacing: '0.5px',
    color: '#4A3B3F',
    backgroundColor: '#FAF6F0',
    borderRadius: '9999px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease',
  },
  popover: {
    backgroundColor: '#D19CAA', /* match reference popover color */
    borderRadius: '12px',
    padding: '16px 20px',
    minWidth: '220px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    color: '#4A3B3F',
  },
  songItem: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
    fontSize: '1.05rem',
  },
  activeDot: {
    width: '6px',
    height: '6px',
    backgroundColor: '#FAF6F0',
    borderRadius: '50%',
    marginRight: '9px',
    display: 'inline-block'
  },
  galleryContainer: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  },
  galleryWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    width: '100%',
    maxWidth: '1200px'
  },
  navButton: {
    color: 'rgba(255,255,255,0.7)',
    padding: '10px'
  },
  mediaFrame: {
    width: '100%',
    maxWidth: '600px',
    height: '75vh',
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(0,0,0,0.65)', /* Dark glass effect */
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(15px)'
  },
  mediaContent: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px'
  },
  media: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    borderRadius: '8px'
  },
  counter: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    letterSpacing: '1px',
    backdropFilter: 'blur(5px)'
  },
  messageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    maxWidth: '600px',
    textAlign: 'center'
  },
  letter: {
    backgroundColor: 'rgba(0,0,0,0.65)', /* Siyah cam efekti */
    padding: '50px 40px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(15px)',
    boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
  },
  messageLine: {
    fontSize: '1.4rem',
    lineHeight: '2rem',
    margin: '10px 0',
    fontWeight: 300
  }
};
