import { showModal } from "./modal";

export function showWinnerModal(fighter) {
  showModal({title: "Winner", bodyElement: fighter});
}
