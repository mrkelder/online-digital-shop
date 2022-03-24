interface StringPayloads {
  name: Exclude<CheckoutStateKeys, "currentStage">;
  value: string;
}

interface NumberPayloads {
  name: "currentStage";
  value: number;
}

type ChangeFiledAction = {
  type: "checkout/changeField";
  payload: StringPayloads | NumberPayloads;
};

type RestoreAction = { type: "checkout/restore" };

export type CheckoutActions = ChangeFiledAction | RestoreAction;
