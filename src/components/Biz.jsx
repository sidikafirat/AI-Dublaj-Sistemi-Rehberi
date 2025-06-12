import React from "react";
import { Tree } from "react-organizational-chart";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css"; // CSS'i de ekleyin
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter, FaGlobe } from "react-icons/fa";

// Takım üyeleri verisi
const teamMembers = [
  {
    id: 1,
    name: "Anıl Sürmeli",
    role: "Backend Geliştirici",
    image:
      "https://media.licdn.com/dms/image/v2/D4D03AQE_AvF9GyTLbw/profile-displayphoto-shrink_400_400/B4DZYxcsk0HwAk-/0/1744586329954?e=1754524800&v=beta&t=9O6spaUXFjrVQ0dMn6XXZcKKwrXKgwzOFOVy2kjNJO8",
    bio: "Node.js, Express.js, Axios, Cheerio, API Geliştirme",
    links: [
      {
        icon: <FaLinkedin />,
        url: "https://www.linkedin.com/in/anilsurmeli/",
      },
      { icon: <FaGithub />, url: "https://github.com/anilsrml" },
    ],
  },
  {
    id: 2,
    name: "Abdulsamet Uçar",
    role: "Frontend Geliştirici",
    image:
      "https://media.licdn.com/dms/image/v2/D4D03AQEJ48rtXcGvBg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1711587805653?e=1754524800&v=beta&t=m891f1CBVyT-Jd0h03X2H-DDBpKwAkW9wfI9yXqdDL4",
    bio: "React, TailwindCSS, Framer Motion, SPA Geliştirme",
    links: [
      {
        icon: <FaLinkedin />,
        url: "https://www.linkedin.com/in/abdulsamet-u%C3%A7ar-8312ba249/",
      },
      { icon: <FaGithub />, url: "https://github.com/Abdulsametucar" },
    ],
  },
  {
    id: 3,
    name: "Sıdıka Firat",
    role: "Frontend Geliştirici",
    image:
      "https://media.licdn.com/dms/image/v2/D4D03AQGgq9niErNwDw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1725133826090?e=1754524800&v=beta&t=BcA3hN26jkrsp23-wjcOOYA9snzjoLQyALjf6_fFnJI",
    bio: "Proje Yöneticisi, React, React-Bootstrap, CSS, Çeviri Doğruluk Kontrolleri, UX/UI Tasarımı",
    links: [
      {
        icon: <FaLinkedin />,
        url: "https://www.linkedin.com/in/s%C4%B1d%C4%B1ka-firat-05ba42254/",
      },
      { icon: <FaGithub />, url: "https://github.com/sidikafirat" },
    ],
  },
  {
    id: 4,
    name: "Umut Beler",
    role: "Veritabanı Tasarımı ve Yönetimi",
    image:
      "https://media.licdn.com/dms/image/v2/D4D03AQE0zN3ld08MKA/profile-displayphoto-shrink_400_400/B4DZctrDgbGUAg-/0/1748817953123?e=1755129600&v=beta&t=P5csmVGcTLJpw0VFrHoek8voufseFFs79uKQSX9dWh4",
    bio: "MySQL, ER Modelleme, İlişkisel Veri Yapısı, Normalizasyon",
    links: [
      {
        icon: <FaLinkedin />,
        url: "https://www.linkedin.com/in/umut-b-b9b691251/",
      },
      { icon: <FaGithub />, url: "https://github.com/belerumut" },
    ],
  },
  {
    id: 5,
    name: "Levent Kutay",
    role: "AWS Altyapı ve CI/CD Uzmanı",
    image:
      "https://media.licdn.com/dms/image/v2/D4D03AQEyF7PxI4sSSQ/profile-displayphoto-shrink_400_400/B4DZUta7ksHwAg-/0/1740223790425?e=1754524800&v=beta&t=PKgpnwOFKGcY96sr4cWMEYhsAxSxB9oeHb5msfwCRXk",
    bio: "AWS IAM, RDS, CodePipeline, Elastic Beanstalk, CloudWatch",
    links: [
      {
        icon: <FaLinkedin />,
        url: "https://www.linkedin.com/in/levent-kutay-sezer-4b9685253/",
      },
      { icon: <FaGithub />, url: "https://github.com" },
    ],
  },
  {
    id: 6,
    name: "Burak Erim",
    role: "Frontend Geliştirici",
    image:
      "https://media.licdn.com/dms/image/v2/D5603AQEwLWGzqDIz_g/profile-displayphoto-shrink_400_400/B56ZdkezlOGsAg-/0/1749737488264?e=1755129600&v=beta&t=mzPlWcqOlZoheeXlHVKrybHM1bnYc4vOPUy_HpaCj7g",
    bio: "React, React-Bootstrap, Kullanıcı Deneyimi Tasarımı",
    links: [
      {
        icon: <FaLinkedin />,
        url: "https://www.linkedin.com/in/burak-erim/",
      },
      { icon: <FaGithub />, url: "https://github.com" },
    ],
  },
];

const Biz = () => {
  return (
    <div className="about-page  max-w-6xl mx-auto py-12 px-4">
      {/* Başlık */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 text-blue-800">Biz Kimiz?</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          AI Dubbing Pro, video içeriklerdeki dil bariyerini kaldırmak için
          geliştirilen yapay zeka destekli bir dublaj sistemidir. Hedefimiz,
          kullanıcıların yabancı videolara anadilinde erişimini kolaylaştırmak
          ve öğrenme/verim süreçlerini hızlandırmaktır.
        </p>
      </motion.div>

      {/* Takım Üyeleri */}
      <section className="mb-20">
        <h2 className="text-3xl font-semibold mb-10 text-center">Ekibimiz</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              whileHover={{ y: -5 }}
              className="relative group w-64 h-64 rounded-full overflow-hidden mx-auto">
              <div className="relative group w-48 h-48 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  data-tooltip-id={`member-${member.id}`}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 rounded-full">
                  <p className="text-white text-center text-sm">{member.bio}</p>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-blue-600 mb-3">{member.role}</p>
                <div className="flex space-x-3 justify-center">
                  {member.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-blue-600 transition-colors">
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>
              <Tooltip id={`member-${member.id}`} place="top" effect="solid">
                {member.bio}
              </Tooltip>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Misyon & Vizyon */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative group w-64 h-64 rounded-full overflow-hidden mx-auto">
          <h3 className="text-2xl font-semibold mb-4 text-blue-700">
            Misyonumuz
          </h3>
          <p className="text-gray-700">
            Misyonumuz, insanların birbirlerini daha iyi anlayabildiği bir dünya
            için, teknolojiyi bir köprü olarak kullanmak. Yapay zeka destekli
            sistemimiz sayesinde kullanıcıların farklı dillerdeki videoları
            hızlı, doğru ve doğal bir şekilde kendi dillerinde
            dinleyebilmelerini sağlıyoruz. Bu doğrultuda: Kullanıcı dostu bir
            arayüz ile herkesin kolayca video yükleyebileceği, dil seçebileceği
            ve çıktı alabileceği bir sistem sunmak, Eğitimden eğlenceye,
            kurumsal iletişimden sosyal farkındalığa kadar geniş bir alanda
            erişilebilir içerik üretimini desteklemek, Geliştirilebilir ve açık
            katkıya uygun altyapılar oluşturarak teknolojiye ilgi duyan herkese
            bu sistemin bir parçası olma imkânı tanımak temel misyonlarımız
            arasındadır. Yalnızca yazılım geliştirmiyoruz — dillerin ötesinde
            bir anlayış ortamı inşa ediyoruz.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative group w-64 h-64 rounded-full overflow-hidden mx-auto">
          <h3 className="text-2xl font-semibold mb-4 text-blue-700">
            Vizyonumuz
          </h3>
          <p className="text-gray-700">
            Dünyanın dört bir yanındaki içeriklerin dil engeline takılmadan
            herkes tarafından erişilebilir olduğu bir dijital gelecek hayal
            ediyoruz. Vizyonumuz, yapay zeka teknolojilerini kullanarak video
            içeriklerin evrensel bir dilde konuşmasını sağlamak, insanların
            bilgiye, eğitime ve kültüre erişimini demokratikleştirmektir. AI
            Dublaj Sistemi ile sadece çeviri değil, duyguyu, anlamı ve
            etkileşimi koruyan doğal bir dublaj deneyimi sunmak istiyoruz.
            Böylece ister bir eğitim videosu, ister bir belgesel, ister bir
            röportaj olsun — herkes kendi anadilinde, gerçek ses doğallığında bu
            içeriklere ulaşabilsin. Gelecekte eğitim, medya, sağlık, hukuk ve
            erişilebilirlik gibi farklı sektörlerde otomatik ve kaliteli çok
            dilli içerik üretimi sağlayan bir dünya standardı olmak en büyük
            hedefimizdir.
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default Biz;
