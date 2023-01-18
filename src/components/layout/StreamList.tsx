import Box from "@/components/elements/Box";
import Textarea from "@/components/elements/Textarea";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useMemo } from "react";

export default function StreamList() {
  const { streamList } = useGlobalContext();

  const formatList = useMemo(() => {
    return streamList.map(
      (v, i) =>
        `${v.name}.${v.extension}${
          v?.video ? `[${v.video}]` : ""
        }[${v.audio.join(":")}]`
    );
  }, [streamList]);

  const caption = "ファイル";
  return (
    <Box isFlexOne caption={caption}>
      <Textarea title={caption} value={formatList.join("\n")} readOnly />
    </Box>
  );
}
