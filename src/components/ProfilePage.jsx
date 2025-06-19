import { useState, useEffect } from "react";
import { Button, Form, ListGroup, Card, Container } from "react-bootstrap";

const ProfilePage = ({ onBack }) => {
  // Kullanıcı bilgileri state'i
  const [userInfo, setUserInfo] = useState({
    name: "Ahmet",
    surname: "Yılmaz",
    email: "ahmet@example.com",
  });

  // Düzenleme modu state'i
  const [isEditing, setIsEditing] = useState(false);

  // Geçmiş URL'ler state'i
  const [history, setHistory] = useState([]);

  // Component yüklendiğinde localStorage'dan geçmişi al
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("urlHistory")) || [];
    setHistory(savedHistory);

    const savedUserInfo =
      JSON.parse(localStorage.getItem("userInfo")) || userInfo;
    setUserInfo(savedUserInfo);
  }, []);

  // Input değişikliklerini handle et
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Bilgileri kaydet
  const handleSave = () => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    setIsEditing(false);
  };

  // URL geçmişinden öğe sil
  const deleteHistoryItem = (index) => {
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
    localStorage.setItem("urlHistory", JSON.stringify(newHistory));
  };

  return (
    <Container className="youtube-transcript-container relative">
      <Button variant="secondary" onClick={onBack} className="mb-3">
        Geri Dön
      </Button>
      <Card>
        <Card.Header as="h4">Profil Bilgileri</Card.Header>
        <Card.Body>
          {isEditing ? (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Ad</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={userInfo.name}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Soyad</Form.Label>
                <Form.Control
                  type="text"
                  name="surname"
                  value={userInfo.surname}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>E-posta</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Button variant="success" onClick={handleSave} className="me-2">
                Kaydet
              </Button>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                İptal
              </Button>
            </Form>
          ) : (
            <>
              <div className="mb-4">
                <p>
                  <strong>Ad:</strong> {userInfo.name}
                </p>
                <p>
                  <strong>Soyad:</strong> {userInfo.surname}
                </p>
                <p>
                  <strong>E-posta:</strong> {userInfo.email}
                </p>
              </div>
              <Button variant="primary" onClick={() => setIsEditing(true)}>
                Düzenle
              </Button>
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
                  className="d-flex justify-content-between align-items-center">
                  <div className="text-truncate" style={{ maxWidth: "80%" }}>
                    {url}
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => deleteHistoryItem(index)}>
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
