import Container from "@/components/elements/Container";
import Wrapper from "@/components/elements/Wrapper";
import { useGlobalContext } from "@/contexts/GlobalContext";
import useDrop from "@/hooks/useDrop";
import useProcess from "@/hooks/useProcess";
import useSettings from "@/hooks/useSettings";
import { useMemo } from "react";

export default function App() {
  const { format, styleTheme } = useGlobalContext();

  useSettings();
  useDrop();
  useProcess();

  const isLoading = useMemo(() => !format || !styleTheme, [format, styleTheme]);

  return <Wrapper>{!isLoading && <Container />}</Wrapper>;
}
