import React, { useState } from 'react';

const MusicXMLTransposer: React.FC = () => {
    const [transposedXML, setTransposedXML] = useState<string | null>(null);
    const [originalFileName, setOriginalFileName] = useState<string>('');
    const [clefChange, setClefChange] = useState<{ from: string; to: string } | null>(null);
    const currentYear = new Date().getFullYear();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
      
        setOriginalFileName(file.name.replace(/\.[^/.]+$/, "")); // Strip extension
      
        const text = await file.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'application/xml');
      
        const clefElements = xmlDoc.getElementsByTagName('clef');
        let from = '';
        let to = '';
      
        for (let i = 0; i < clefElements.length; i++) {
          const sign = clefElements[i].getElementsByTagName('sign')[0];
          const line = clefElements[i].getElementsByTagName('line')[0];
      
          if (sign && line) {
            if (sign.textContent === 'G' && line.textContent === '2') {
              from = 'treble';
              to = 'bass';
              sign.textContent = 'F';
              line.textContent = '4';
            } else if (sign.textContent === 'F' && line.textContent === '4') {
              from = 'bass';
              to = 'treble';
              sign.textContent = 'G';
              line.textContent = '2';
            }
          }
        }
      
        setClefChange({ from, to });
      
        const serializer = new XMLSerializer();
        const newXML = serializer.serializeToString(xmlDoc);
        setTransposedXML(newXML);
      };

      const downloadFile = () => {
        if (!transposedXML) return;
      
        const suffix = clefChange ? `_transposed_${clefChange.from}_to_${clefChange.to}` : '_transposed';
        const finalName = `${originalFileName}${suffix}.musicxml`;
      
        const blob = new Blob([transposedXML], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = finalName;
        a.click();
        URL.revokeObjectURL(url);
      };

      return (
        <div>
          <h1>MusicXML Clef Transposer</h1>
          <h2>Convert treble clef to bass clef and vice versa</h2>
      
          <div className="upload-section">
            <input type="file" accept=".musicxml,.xml" onChange={handleFileChange} />
            {transposedXML && <button onClick={downloadFile}>Download Transposed File</button>}
          </div>
      
          <div className="instructions">
            <h3>Steps:</h3>
            <ol>
              <li>Select a <strong>.musicxml</strong> file from your computer.</li>
              <li>This tool automatically detects and switches G (treble) ↔ F (bass) clefs.</li>
              <li>Click the download button to save the converted file.</li>
              <li>Open the file in your notation software (e.g., Guitar Pro).</li>
              <li>If the notes appear too high or low, shift them by an octave for correct staff placement.</li>
            </ol>
            <p>
              Tip: In Guitar Pro, after importing the file, you can easily adjust the track's octave so that notes fit well on the new clef’s staff lines.
            </p>

            
          
          </div>
          
          <div style={{
              marginTop: '10rem'}}>
          <p style={{
              marginTop: '10rem',
              bottom: '2',
              width: '100%',
              textAlign: 'center',
              color: 'white',
              fontWeight: 'bold',
              margin: '0'
            }}>
              © {currentYear} Zubin Madon<br/> 
              github.com/zubin-madon
            </p>
            </div>
        </div>
      );
      
  
};

export default MusicXMLTransposer;
