import Box from "@/components/elements/Box";
import Textarea from "@/components/elements/Textarea";
import { useGlobalContext } from "@/contexts/GlobalContext";

export default function Log() {
  const { logList: log } = useGlobalContext();

  const caption = "ログ";
  return (
    <Box isFlexOne caption={caption}>
      <Textarea title={caption} value={log.join("\n")} readOnly />
    </Box>
  );
}
