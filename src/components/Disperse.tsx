import React, { useState } from "react";
import LineNumberedTextarea from "./LineNumbersTextarea";

interface Props {}

const Disperse: React.FC<Props> = () => {
  const [inputText, setInputText] = useState<string>("");
  const [lines, setLines] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [showDuplicate, setShowDuplicate] = useState<boolean>(false);

  const validateLines = (lines: string[]) => {
    setShowDuplicate(false);
    const validationErrors: string[] = [];
    const addressMap: Map<string, number[]> = new Map();

    lines.forEach((line, index) => {
      const parts = line.trim().split(/\s|,|=/); // Split by space, comma, or equals

      if (parts.length !== 2) {
        validationErrors.push(
          `Line ${
            index + 1
          } is invalid: The address and amount should be separated by the delimiter of space (‘ ’), equals (=), or comma (,).`
        );
        return;
      }

      const [address, amount] = parts;

      const isAddressValid = address.length === 42 && address.startsWith("0x");
      const isAmountValid = !isNaN(Number(amount)) && parseFloat(amount) > 0;

      if (!isAddressValid && !isAmountValid) {
        validationErrors.push(
          `Line ${index + 1} invalid Ethereum address and wrong amount.`
        );
      } else if (!isAddressValid) {
        validationErrors.push(
          `Line ${index + 1} has an invalid Ethereum address`
        );
      } else if (!isAmountValid) {
        validationErrors.push(`Line ${index + 1} has an invalid amount`);
      }

      // Check for duplicates
      if (!validationErrors.length && addressMap.has(address)) {
        const existingLineNumbers: any = addressMap.get(address);
        existingLineNumbers.push(index + 1);
        addressMap.set(address, existingLineNumbers);
      } else {
        addressMap.set(address, [index + 1]);
      }
    });

    // Find and report duplicates
    addressMap.forEach((lineNumbers, address) => {
      if (lineNumbers.length > 1) {
        setShowDuplicate(true);
        validationErrors.push(
          `Address ${address} is duplicated in line(s): ${lineNumbers
            .map((lineNumber) => lineNumber + 1)
            .join(", ")}`
        );
      }
    });

    setErrors(validationErrors);
  };

  const handleDuplicateOption = (selectedOption: string) => {
    if (selectedOption === "combine") {
      const combinedLines: any = {};

      lines.forEach((line, index) => {
        const parts = line.trim().split(/\s|,|=/);
        const [address, amount] = parts;
        if (combinedLines[address]) {
          // Combine amounts for duplicate addresses
          combinedLines[address] += parseFloat(amount);
        } else {
          combinedLines[address] = parseFloat(amount);
        }
      });
      const processedLines = Object.keys(combinedLines).map(
        (address) => `${address}=${combinedLines[address]}`
      );

      setLines(processedLines);
      setInputText(processedLines.join("\n"));
    } else {
      const uniqueAddresses: any = {};
      lines.forEach((line, index) => {
        const parts = line.trim().split(/\s|,|=/);
        const [address, amount] = parts;
        if (!uniqueAddresses[address]) {
          uniqueAddresses[address] = amount;
        }
      });
      const processedLines = Object.keys(uniqueAddresses).map(
        (address) => `${address}=${uniqueAddresses[address]}`
      );
      setLines(processedLines);
      setInputText(processedLines.join("\n").toString());
    }
    setErrors([]);
    setShowDuplicate(false);
  };

  const handleSubmit = () => {
    const linesArray = inputText.split("\n");
    validateLines(linesArray);
  };

  return (
    <div className="container">
      <div className="header-section">
        <div>Addresses with Amounts</div>
        <div>Upload File</div>
      </div>

      <LineNumberedTextarea
        value={inputText}
        onChange={setInputText}
        lines={lines}
        setLines={setLines}
      />

      <div className="header-section note-section">
        <div>Separated by ',' or '' or '='</div>
        <div className="show-example">Show Example</div>
      </div>

      {showDuplicate && (
        <div className="header-section">
          <div>Duplicated</div>
          <section className="show-duplication">
            <div onClick={() => handleDuplicateOption("keep")}>
              Keep the first one
            </div>
            <span>|</span>
            <div onClick={() => handleDuplicateOption("combine")}>
              Combine Balance
            </div>
          </section>
        </div>
      )}

      {errors && errors.length > 0 && (
        <div className="error-container">
          {errors.map((error) => (
            <div className="error" key={error}>
              <p>{error}</p>
            </div>
          ))}
        </div>
      )}
      <button className="next-btn" onClick={handleSubmit}>
        Next
      </button>
    </div>
  );
};

export default Disperse;
