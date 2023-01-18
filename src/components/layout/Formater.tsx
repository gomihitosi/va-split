import Box from "@/components/elements/Box";
import Row from "@/components/elements/Row";
import SelectBox from "@/components/elements/SelectBox";
import { useGlobalContext } from "@/contexts/GlobalContext";
import {
  AacEncodeOptions,
  AacVbrQuality,
  AacVbrQualityOptions,
  BitRate,
  BitRateOptions,
  Encode,
  EncodeOptions,
  Mp3VbrQuality,
  Mp3VbrQualityOptions,
  OggVbrQuality,
  OggVbrQualityOptions,
  SamplingRateOptions,
  Transfer,
  TransferOptions,
  WavSampleBit,
  WavSampleBitOptions,
} from "@/stores/setting";
import { ChangeEvent, useMemo } from "react";

// FIXME: settings.jsonとの兼ね合いで各値をstringで保持している…
export default function Formater() {
  const { format, setFormat } = useGlobalContext();

  if (!format) {
    return <></>;
  }

  const encodeOptions = useMemo(() => {
    if (
      format.transfer === Transfer.Mp3.value ||
      format.transfer === Transfer.Ogg.value
    ) {
      return EncodeOptions;
    }
    if (format.transfer === Transfer.Aac.value) {
      return AacEncodeOptions;
    }
    return {};
  }, [format]);

  const codecOptions = useMemo(() => {
    if (format.encode === Encode.VBR.value) {
      if (format.transfer === Transfer.Mp3.value) {
        return Mp3VbrQualityOptions;
      }
      if (format.transfer === Transfer.Ogg.value) {
        return OggVbrQualityOptions;
      }
      if (format.transfer === Transfer.Aac.value) {
        return AacVbrQualityOptions;
      }
    }
    if (
      format.encode === Encode.ABR.value ||
      format.encode === Encode.CBR.value
    ) {
      return BitRateOptions;
    }
    return {};
  }, [format]);

  const handleTransferChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const transfer = e.target.value;
    const updateFormat = {
      ...format,
      transfer,
    };
    if (transfer === Transfer.Wav.value) {
      updateFormat.encode = undefined;
      updateFormat.codec = WavSampleBit.pcmS16Le.value;
    }
    if (transfer === Transfer.Mp3.value) {
      updateFormat.encode = Encode.CBR.value;
      updateFormat.codec = BitRate.kbps256.value;
    }
    if (transfer === Transfer.Ogg.value) {
      updateFormat.encode = Encode.VBR.value;
      updateFormat.codec = OggVbrQuality.Q8.value;
    }
    if (transfer === Transfer.Aac.value) {
      updateFormat.encode = Encode.VBR.value;
      updateFormat.codec = AacVbrQuality.Q2.value;
    }
    setFormat(updateFormat);
  };

  const handleEncodeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const encode = e.target.value;
    const updateFormat = {
      ...format,
      encode,
    };
    if (encode === Encode.VBR.value) {
      if (format.transfer === Transfer.Mp3.value) {
        updateFormat.codec = Mp3VbrQuality.Q0.value;
      }
      if (format.transfer === Transfer.Ogg.value) {
        updateFormat.codec = OggVbrQuality.Q8.value;
      }
      if (format.transfer === Transfer.Aac.value) {
        updateFormat.codec = Mp3VbrQuality.Q2.value;
      }
    }
    if (encode === Encode.ABR.value || encode === Encode.CBR.value) {
      updateFormat.codec = BitRate.kbps256.value;
    }
    setFormat(updateFormat);
  };

  const handleSamplingRateChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormat({ ...format, samplingRate: e.target.value });
  };

  const handleCodecChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormat({ ...format, codec: e.target.value });
  };

  return (
    <>
      <Box isFlexOne caption="出力設定">
        <Row>
          <SelectBox
            title="出力形式"
            value={format.transfer}
            onChange={handleTransferChange}
            options={TransferOptions}
          />
          <SelectBox
            title="サンプリングレート"
            value={format.samplingRate}
            onChange={handleSamplingRateChange}
            options={SamplingRateOptions}
          />
        </Row>
        <Row>
          {format.transfer === Transfer.Wav.value && (
            <>
              <SelectBox
                title="コーデック"
                value={format.codec}
                onChange={handleCodecChange}
                options={WavSampleBitOptions}
              />
            </>
          )}
          {(format.transfer === Transfer.Mp3.value ||
            format.transfer === Transfer.Ogg.value ||
            format.transfer === Transfer.Aac.value) && (
            <>
              <SelectBox
                title="エンコード"
                value={format.encode}
                onChange={handleEncodeChange}
                options={encodeOptions}
              />
              <SelectBox
                title="ビットレート/クオリティ"
                value={format.codec}
                onChange={handleCodecChange}
                options={codecOptions}
              />
            </>
          )}
        </Row>
      </Box>
    </>
  );
}
