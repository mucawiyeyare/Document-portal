import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FileText, Image, FileBox, FileArchive } from 'lucide-react';

const StudentFiles = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await api.get('/files');
      setFiles(res.data);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  const getFileIcon = (mimeType) => {
    if (mimeType.includes('pdf')) return <FileText size={32} color="#ef4444" />;
    if (mimeType.includes('image')) return <Image size={32} color="#3b82f6" />;
    if (mimeType.includes('word')) return <FileBox size={32} color="#2563eb" />;
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return <FileBox size={32} color="#16a34a" />;
    return <FileArchive size={32} color="#f59e0b" />;
  };

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FileText /> Available Documents
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {files.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No documents available to view at this time.
          </div>
        ) : (
          files.map(file => (
            <div 
              key={file._id} 
              onClick={() => navigate(`/view/${file._id}`)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                padding: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
            >
              {getFileIcon(file.fileType)}
              <div style={{ textAlign: 'center', width: '100%' }}>
                <div style={{ fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={file.originalName}>
                  {file.originalName}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {new Date(file.uploadDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentFiles;
