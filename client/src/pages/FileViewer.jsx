import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import SecurityWrapper from '../components/SecurityWrapper';
import api from '../utils/api';
import { ArrowLeft } from 'lucide-react';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

const FileViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [metadata, setMetadata] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // The actual URL mapped by the interceptor proxy or absolute server path
  const [fileUrl, setFileUrl] = useState('');
  const [officeContent, setOfficeContent] = useState('');

  useEffect(() => {
    const fetchFileMeta = async () => {
      try {
        // Fetch metadata to know the file type
        const res = await api.get('/files');
        const file = res.data.find(f => f._id === id);
        if (file) {
          setMetadata(file);
          // Set secure access URL with token in query or as a blob config
          fetchFileBlob();
        } else {
          setError('File not found');
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to load file');
        setLoading(false);
      }
    };

    fetchFileMeta();
  }, [id]);

  const fetchFileBlob = async () => {
    try {
      const response = await api.get(`/files/view/${id}`, { responseType: 'blob' });
      const mime = response.headers['content-type']?.toLowerCase() || '';
      console.log('Received file with MIME type:', mime, 'Size:', response.data.size);
      
      const fileBlob = new Blob([response.data], { type: response.headers['content-type'] });
      
      // If it's Word Document
      if (mime.includes('wordprocessingml') || mime.includes('msword')) {
        console.log('Parsing Word Document...');
        const arrayBuffer = await fileBlob.arrayBuffer();
        mammoth.convertToHtml({ arrayBuffer })
          .then(result => {
             console.log('Word Document parsed:', result.messages);
             setOfficeContent(result.value || '<p>Document has no readable text.</p>');
             setLoading(false);
          })
          .catch(err => {
             console.error('Word Doc Parse Error:', err);
             setError('Failed to parse Word Document');
             setLoading(false);
          });
        return;
      }
      
      // If it's Excel
      if (mime.includes('sheet') || mime.includes('excel')) {
        console.log('Parsing Excel Document...');
        const arrayBuffer = await fileBlob.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const htmlString = XLSX.utils.sheet_to_html(workbook.Sheets[sheetName]);
        setOfficeContent(htmlString || '<p>Spreadsheet has no readable structural data.</p>');
        setLoading(false);
        return;
      }

      console.log('Creating Object URL for non-office file...');
      // Default URL create for Images and PDF
      const url = URL.createObjectURL(fileBlob);
      setFileUrl(url);
      setLoading(false);
    } catch (err) {
      console.error('Fetch File Blob Error:', err);
      setError('Could not load secure file stream');
      setLoading(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const renderContent = () => {
    if (loading) return <div>Loading secure stream...</div>;
    if (error) return <div style={{ color: 'var(--danger)' }}>{error}</div>;

    if (!metadata) return null;
    const mime = metadata.fileType.toLowerCase();

    // WORD / EXCEL — these set officeContent, NOT fileUrl, so check first
    if (mime.includes('msword') || mime.includes('wordprocessingml') || mime.includes('sheet') || mime.includes('presentation') || mime.includes('excel')) {
      if (officeContent) {
        return (
          <div
            style={{
              background: 'white',
              color: 'black',
              padding: '2rem',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '800px',
              overflowX: 'auto',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none'
            }}
            dangerouslySetInnerHTML={{ __html: officeContent }}
          />
        );
      }
      return (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
          <h3>Loading Office Document...</h3>
        </div>
      );
    }

    // IMAGE and PDF require fileUrl
    if (!fileUrl) return null;

    // IMAGE
    if (mime.includes('image')) {
      return (
        <img
          src={fileUrl}
          alt={metadata.originalName}
          style={{ maxWidth: '100%', borderRadius: '8px', pointerEvents: 'none' }}
        />
      );
    }

    // PDF
    if (mime.includes('pdf')) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading="Loading PDF..."
          >
            <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} />
          </Document>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              className="btn"
              style={{ padding: '0.5rem 1rem' }}
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber(p => p - 1)}
            >
              Previous
            </button>
            <span>Page {pageNumber} of {numPages}</span>
            <button
              className="btn"
              style={{ padding: '0.5rem 1rem' }}
              disabled={pageNumber >= numPages}
              onClick={() => setPageNumber(p => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      );
    }

    return <div>Unsupported secure view format.</div>;
  };

  return (
    <SecurityWrapper studentName={user?.name || 'Guest'}>
      <div className="glass card-container" style={{ position: 'relative' }}>
        <button 
          onClick={() => navigate(user?.role === 'admin' ? '/upload' : '/files')} 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}
        >
          <ArrowLeft size={20} /> Back
        </button>

        {metadata && <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Viewing: {metadata.originalName}</h2>}
        
        <div style={{ display: 'flex', justifyContent: 'center', minHeight: '60vh' }}>
          {renderContent()}
        </div>
      </div>
    </SecurityWrapper>
  );
};

export default FileViewer;
