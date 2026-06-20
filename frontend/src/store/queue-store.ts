import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface QueueToken {
  id: string;
  token: string;
  patientName: string;
  waitTime: string;
  status: "Ready" | "Waiting" | "Checked In";
  borderHighlight: "secondary" | "primary" | "success";
}

export interface QueueState {
  tokens: QueueToken[];
  servingToken: string;
  servingDoctor: string;
  servingRoom: string;
  isLoading: boolean;
}

export interface QueueActions {
  addToken: (
    patientName: string,
    doctorDept: string,
    urgency: "Routine" | "Urgent",
  ) => void;
  serveToken: (token: QueueToken) => void;
  clearQueue: () => void;
  setTokens: (tokens: QueueToken[]) => void;
}

export type QueueStore = QueueState & QueueActions;

const defaultTokens: QueueToken[] = [
  {
    id: "1",
    token: "A-129",
    patientName: "Kenji Sato",
    waitTime: "08 mins",
    status: "Ready",
    borderHighlight: "secondary",
  },
  {
    id: "2",
    token: "A-130",
    patientName: "Minato Takahashi",
    waitTime: "14 mins",
    status: "Waiting",
    borderHighlight: "primary",
  },
  {
    id: "3",
    token: "B-042",
    patientName: "Akiko Yamamoto",
    waitTime: "22 mins",
    status: "Waiting",
    borderHighlight: "primary",
  },
  {
    id: "4",
    token: "A-131",
    patientName: "Haruto Suzuki",
    waitTime: "35 mins",
    status: "Checked In",
    borderHighlight: "success",
  },
];

export const useQueueStore = create<QueueStore>()(
  subscribeWithSelector((set) => ({
    tokens: defaultTokens,
    servingToken: "A-128",
    servingDoctor: "Dr. S. Tanaka",
    servingRoom: "Consultation 4",
    isLoading: false,

    addToken: (patientName, _doctorDept, urgency) => {
      const id = Date.now().toString();
      const tokenNumber = Math.floor(Math.random() * 800) + 100;
      const prefix = urgency === "Urgent" ? "B" : "A";
      const token = `${prefix}-${tokenNumber}`;

      const newToken: QueueToken = {
        id,
        token,
        patientName,
        waitTime: "00 mins",
        status: urgency === "Urgent" ? "Ready" : "Waiting",
        borderHighlight: urgency === "Urgent" ? "secondary" : "primary",
      };

      set((state) => ({
        tokens: [...state.tokens, newToken],
      }));
    },

    serveToken: (token) => {
      // Parse doctor/room from token or just assign a random one for simulation
      const doctorsList = [
        "Dr. S. Tanaka",
        "Dr. H. Watanabe",
        "Dr. K. Sato",
        "Dr. M. Kimura",
      ];
      const randomDoctor =
        doctorsList[Math.floor(Math.random() * doctorsList.length)];
      const randomRoom = `Consultation ${Math.floor(Math.random() * 6) + 1}`;

      set((state) => ({
        servingToken: token.token,
        servingDoctor: randomDoctor,
        servingRoom: randomRoom,
        tokens: state.tokens.filter((t) => t.id !== token.id),
      }));
    },

    clearQueue: () => {
      set({ tokens: [] });
    },

    setTokens: (tokens) => {
      set({ tokens });
    },
  })),
);
