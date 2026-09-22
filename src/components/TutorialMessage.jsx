export default function TutorialMessage({ texto }) {
  return (
    <div className="tutorial-msg">
      <span className="msg-arrow">▼</span>
      <span className="msg-texto">{texto}</span>
      <span className="msg-arrow">▼</span>
    </div>
  );
}