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
    name: "Ahmet Yılmaz",
    role: "Takım Lideri",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Proje yönetimi ve iş geliştirme uzmanı. 10+ yıllık deneyim.",
    links: [
      { icon: <FaLinkedin />, url: "https://linkedin.com" },
      { icon: <FaGithub />, url: "https://github.com" },
    ],
  },
  {
    id: 2,
    name: "Mehmet Kaya",
    role: "Yapay Zeka Uzmanı",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    bio: "Makine öğrenmesi ve derin öğrenme konusunda uzman.",
    links: [
      { icon: <FaLinkedin />, url: "https://linkedin.com" },
      { icon: <FaTwitter />, url: "https://twitter.com" },
    ],
  },
  {
    id: 3,
    name: "Ayşe Demir",
    role: "Frontend Geliştirici",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "React ve modern web teknolojileri konusunda uzman.",
    links: [
      { icon: <FaGithub />, url: "https://github.com" },
      { icon: <FaGlobe />, url: "https://personalwebsite.com" },
    ],
  },
  {
    id: 4,
    name: "Fatma Şahin",
    role: "Backend Geliştirici",
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    bio: "Node.js ve veritabanı sistemleri konusunda uzman.",
    links: [
      { icon: <FaLinkedin />, url: "https://linkedin.com" },
      { icon: <FaGithub />, url: "https://github.com" },
    ],
  },
  {
    id: 5,
    name: "Can Aydın",
    role: "Test Mühendisi",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
    bio: "Kalite güvence ve otomasyon testleri konusunda uzman.",
    links: [
      { icon: <FaLinkedin />, url: "https://linkedin.com" },
      { icon: <FaTwitter />, url: "https://twitter.com" },
    ],
  },
  {
    id: 6,
    name: "Zeynep Koç",
    role: "UI/UX Tasarımcı",
    image: "https://randomuser.me/api/portraits/women/66.jpg",
    bio: "Kullanıcı deneyimi ve arayüz tasarımı konusunda uzman.",
    links: [
      { icon: <FaGlobe />, url: "https://personalwebsite.com" },
      { icon: <FaLinkedin />, url: "https://linkedin.com" },
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
              className="team-card bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative group">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                  data-tooltip-id={`member-${member.id}`}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                  <p className="text-white text-center">{member.bio}</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-blue-600 mb-3">{member.role}</p>
                <div className="flex space-x-3">
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

      {/* Organizasyon Şeması */}
      <section className="mb-20">
        <h2 className="text-3xl font-semibold mb-10 text-center">
          Takım Yapısı
        </h2>
        <div className="flex justify-center bg-white p-6 rounded-lg shadow-lg">
          <Tree
            lineWidth={"2px"}
            lineColor={"#3b82f6"}
            lineBorderRadius={"10px"}
            label={
              <div className="bg-blue-100 p-3 rounded-lg border border-blue-300">
                <div className="font-bold text-lg text-blue-800">
                  Ahmet Yılmaz
                </div>
                <div className="text-sm text-blue-600">Takım Lideri</div>
              </div>
            }>
            <Tree
              label={
                <div className="bg-blue-50 p-2 rounded border border-blue-200">
                  <div className="font-medium text-blue-700">Mehmet Kaya</div>
                  <div className="text-xs text-blue-500">Yapay Zeka Uzmanı</div>
                </div>
              }
            />
            <Tree
              label={
                <div className="bg-blue-50 p-2 rounded border border-blue-200">
                  <div className="font-medium text-blue-700">Ayşe Demir</div>
                  <div className="text-xs text-blue-500">
                    Frontend Geliştirici
                  </div>
                </div>
              }
            />
            <Tree
              label={
                <div className="bg-blue-50 p-2 rounded border border-blue-200">
                  <div className="font-medium text-blue-700">Fatma Şahin</div>
                  <div className="text-xs text-blue-500">
                    Backend Geliştirici
                  </div>
                </div>
              }
            />
            <Tree
              label={
                <div className="bg-blue-50 p-2 rounded border border-blue-200">
                  <div className="font-medium text-blue-700">Can Aydın</div>
                  <div className="text-xs text-blue-500">Test Mühendisi</div>
                </div>
              }
            />
            <Tree
              label={
                <div className="bg-blue-50 p-2 rounded border border-blue-200">
                  <div className="font-medium text-blue-700">Zeynep Koç</div>
                  <div className="text-xs text-blue-500">UI/UX Tasarımcı</div>
                </div>
              }
            />
          </Tree>
        </div>
      </section>

      {/* Misyon & Vizyon */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-blue-700">
            Misyonumuz
          </h3>
          <p className="text-gray-700">
            Evrensel bilgiye erişimi kolaylaştırmak için, yapay zekayı herkesin
            faydalanabileceği bir araç haline getirmeyi ve farklı dillerdeki
            video içerikleri erişilebilir kılmayı misyon edindik.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-blue-700">
            Vizyonumuz
          </h3>
          <p className="text-gray-700">
            Yapay zeka teknolojilerini kullanıcı dostu sistemlere entegre
            ederek, bilgiye erişimi kolaylaştıran, hızlı, doğru ve
            kişiselleştirilmiş çözümler sunan öncü uygulamalar geliştirmek.
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default Biz;
