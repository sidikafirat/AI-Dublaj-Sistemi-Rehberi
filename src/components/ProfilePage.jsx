import { useState, useEffect } from "react";
import { Button, Form, ListGroup, Card, Container } from "react-bootstrap";

const ProfilePage = ({ onBack, previousPage }) => {
  const [userInfo, setUserInfo] = useState(null); // Yüklenme durumu için null
  const [isEditing, setIsEditing] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Geçmiş URL'leri al
    const savedHistory = JSON.parse(localStorage.getItem("urlHistory")) || [];
    setHistory(savedHistory);

    // Kullanıcı bilgilerini API'den çek
    const userId = localStorage.getItem("user_id");
    if (userId) {
      fetch(`http://localhost:5000/user/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            setUserInfo({
              name: data.user.name,
              email: data.user.email,
            });
          }
        })
        .catch((err) => console.error("Kullanıcı bilgileri alınamadı:", err));
    }
  }, []);

  // Yükleniyorsa göstermek için
  if (!userInfo) {
    return <p>Yükleniyor...</p>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      fetch(`http://localhost:5000/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            alert("Bilgiler güncellendi.");
            setIsEditing(false);
          } else {
            alert("Güncelleme başarısız: " + data.message);
          }
        })
        .catch((err) => console.error("Güncelleme hatası:", err));
    }
  };

  const deleteHistoryItem = (index) => {
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
    localStorage.setItem("urlHistory", JSON.stringify(newHistory));
  };

  const handleGoBack = () => {
    if (previousPage) onBack(previousPage);
    else onBack("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    // Gerekirse diğer localStorage verilerini de temizleyebilirsin
    window.location.href = "/auth";
  };

  return (
    <Container className="youtube-transcript-container relative">
      <Button variant="secondary" onClick={handleGoBack} className="mb-3">
        Geri Dön
      </Button>

      <Card>
        <Card.Header as="h4">Profil Bilgileri</Card.Header>
        <Card.Body>
          {isEditing ? (
            <Form>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Ad Soyad</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={userInfo.name}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>E-posta</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <div className="d-flex gap-2 justify-content-center mt-3">
                <Button variant="success" onClick={handleSave}>
                  Kaydet
                </Button>
                <Button variant="secondary" onClick={() => setIsEditing(false)}>
                  İptal
                </Button>
              </div>
            </Form>
          ) : (
            <>
              <div className="mb-4">
                <p>
                  <strong>Ad Soyad:</strong> {userInfo.name}
                </p>
                <p>
                  <strong>E-posta:</strong> {userInfo.email}
                </p>
              </div>

              <div className="d-flex gap-2 justify-content-center mt-3">
                <Button variant="primary" onClick={() => setIsEditing(true)}>
                  Düzenle
                </Button>
                <Button variant="danger" onClick={handleLogout}>
                  Çıkış Yap
                </Button>
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      <Card className="mt-4">
        <Card.Header as="h4">Geçmiş URL'ler</Card.Header>
        <Card.Body>
          {history.length === 0 ? (
            <p>Henüz geçmiş bulunmamaktadır.</p>
          ) : (
            <ListGroup>
              {history.map((url, index) => (
                <ListGroup.Item
                  key={index}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div className="text-truncate" style={{ maxWidth: "80%" }}>
                    {url}
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => deleteHistoryItem(index)}
                  >
                    Sil
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage;
