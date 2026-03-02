import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { UploadCloud, File, Trash2, AlertCircle } from 'lucide-react';

const AdminUpload = () => {
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setSuccess('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file first');
      return;
    }
    if (!subject.trim()) {
      setError('Please enter a subject');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('subject', subject);

    setLoading(true);
    setError('');
    try {
      await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('File uploaded successfully!');
      setFile(null);
      setSubject('');
      document.getElementById('file-input').value = '';
      fetchFiles();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Upload failed. Check file type restrictions.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    
    try {
      await api.delete(`/files/${id}`);
      fetchFiles();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
      <div className="glass" style={{ padding: '2rem', height: 'fit-content' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UploadCloud /> Upload New File
        </h2>
        
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertCircle size={16}/> {error}</div>}
        {success && <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{success}</div>}

        <form onSubmit={handleUpload}>
          <div style={{ marginBottom: '1rem' }}>
            <input 
              type="text" 
              placeholder="Enter Document Subject" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
              required 
              style={{ padding: '0.75rem 1rem', width: '100%', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
            />
          </div>
          <input 
            id="file-input"
            type="file" 
            onChange={handleFileChange} 
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.xlsx,.pptx"
            style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', width: '100%', marginBottom: '0.5rem' }}
          />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Allowed types: PDF, Word, Excel, PPT, Images. Max 50MB.
          </p>
          <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading || !file || !subject.trim()}>
            {loading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>
      </div>

      <div className="glass" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Managed Files ({files.length})</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {files.map(f => (
            <div key={f._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <File color="var(--primary)" size={24} />
                <div>
                  <div style={{ fontWeight: '500' }}>{f.originalName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {new Date(f.uploadDate).toLocaleDateString()} • {f.fileType.split('/')[1]?.toUpperCase() || 'DOCUMENT'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => window.open(`/view/${f._id}`, '_blank')} className="btn" style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.2)', color: 'var(--primary)', border: 'none' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>View</span>
                </button>
                <button onClick={() => handleDelete(f._id)} className="btn-danger" style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)', border: 'none' }}>
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
          {files.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No files uploaded yet.</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminUpload;
