import { X } from "lucide-react";
import { useState } from "react";
import "./ReportAnnounces..css";
import { reportData } from "./reportData";

interface Annonce {
  id: number;
  title?: string;
  [key: string]: string | number | boolean | undefined;
}
interface UserData {
  id: number;
  username?: string;
  [key: string]: string | number | boolean | undefined;
}
interface Message {
  id: number;
  content?: string;
  [key: string]: string | number | boolean | undefined;
}

type ReportAnnouncesProps =
  | { targetType: "annonce"; data: Annonce }
  | { targetType: "user"; data: UserData }
  | { targetType: "message"; data: Message };

interface ReportReason {
  id: string;
  label: string;
  desc: string;
}

function ReportAnnounces({ targetType, data }: ReportAnnouncesProps) {
  const currentReasons = reportData[targetType] ?? [];
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(
    null,
  );
  const [description, setDescription] = useState("");
  const [confirmations, setConfirmations] = useState("");
  const [modalOpens, setModalOpens] = useState(false);
  const [modalOpens1, setModalOpens1] = useState(false);
  const [modalOpens2, setModalOpens2] = useState(false);
  const openModal = () => {
    setModalOpens(true);
  };

  const closeModal1 = () => {
    setModalOpens1(false);
  };

  const handleclickreason = (reason: ReportReason) => {
    setSelectedReason(reason);
    setModalOpens1(true);
    setModalOpens(false);
  };

  const handleclickreport = async () => {
    const payload = {
      reporter_id: "",
      description: selectedReason?.label,
      cause: description,
      status: "PENDING",
      reported_announce_id: targetType === "annonce" ? data.id : null,
      reported_user_id: targetType === "user" ? data.id : null,
      reported_message_id: targetType === "message" ? data.id : null,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reports`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        setModalOpens1(false);
        setModalOpens2(true);
        setConfirmations("Ton report a bien été envoyé");
      } else {
        setModalOpens1(false);
        setModalOpens2(true);
        setConfirmations("Une erreur est survenue lors de l'envoi.");
      }
    } catch {}
  };

  const handleclose = () => {
    setModalOpens2(false);
    setModalOpens1(false);
  };
  return (
    <>
      <button
        type="button"
        className="secondary"
        onClick={openModal}
        aria-label="report"
      >
        Report
      </button>

      {modalOpens && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-ul">
              {currentReasons.map((reason) => (
                <div key={reason.id}>
                  <button
                    type="button"
                    className="modal-li"
                    onClick={() => handleclickreason(reason)}
                  >
                    {reason.label}
                    <img
                      className="fleche-report"
                      src="../src/assets/icons/fleche.svg"
                      alt="fleche"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {modalOpens1 && (
        <div className="modal-overlay1">
          <div className="modal-content1">
            <div>
              <div className="motif-report">
                {selectedReason?.label}
                <textarea
                  maxLength={203}
                  placeholder="Please explain the reason for your report as precisely as possible."
                  style={{ fontStyle: "italic" }}
                  className="text-report"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="button-modal2">
                <button
                  type="button"
                  className="secondary poulet"
                  onClick={handleclickreport}
                  aria-label="close popup"
                >
                  report
                </button>
              </div>
              <button type="button" className="close-x" onClick={closeModal1}>
                <X size={35} />
              </button>
            </div>
          </div>
        </div>
      )}
      {modalOpens2 && (
        <div className="modal-overlay1">
          <div className="modal-content1">
            <div>
              <h4>{confirmations}</h4>
              <div className="button-modal2">
                <button
                  type="button"
                  className="primary"
                  onClick={handleclose}
                  aria-label="close modal"
                >
                  thank you
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ReportAnnounces;
