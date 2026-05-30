import React, { useState, useMemo, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, CheckCircle2, XCircle, ChevronUp, ChevronDown, ArrowUpDown, Search, X } from 'lucide-react';
import { db, storage } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { products as localProducts } from './data/products';

const ProductsAdmin = ({ products, onProductChange }) => {
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [search, setSearch] = useState('');

  // Auto-fix existing repetitions in the database
  useEffect(() => {
    const fixRepetitions = async () => {
      const needsFixing = products.filter(p => {
        if (!p.bullets) return false;
        let bulletsArray = Array.isArray(p.bullets) ? p.bullets : (typeof p.bullets === 'string' ? p.bullets.split('\n') : []);
        if (bulletsArray.length === 0) return false;
        const unique = new Set(bulletsArray.map(b => typeof b === 'string' ? b.trim() : b).filter(Boolean));
        return unique.size !== bulletsArray.filter(Boolean).length || typeof p.bullets === 'string'; // Force arrays instead of strings
      });
      
      if (needsFixing.length > 0) {
        let fixedCount = 0;
        for (const p of needsFixing) {
          try {
            let bulletsArray = Array.isArray(p.bullets) ? p.bullets : (typeof p.bullets === 'string' ? p.bullets.split('\n') : []);
            const uniqueBullets = Array.from(new Set(bulletsArray.map(b => typeof b === 'string' ? b.trim() : b).filter(Boolean)));
            await setDoc(doc(db, "products", p.id.toString()), { bullets: uniqueBullets }, { merge: true });
            fixedCount++;
          } catch (e) {
            console.error("Failed to auto-fix product", p.id, e);
          }
        }
        if (fixedCount > 0) {
          onProductChange(); // Reload products to reflect fixed database
        }
      }
    };
    
    if (products.length > 0) {
      fixRepetitions();
    }
  }, [products, onProductChange]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const s = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s) ||
        p.subniche.toLowerCase().includes(s)
      );
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [products, sortConfig, search]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={14} style={{ opacity: 0.3 }} />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const handleForceSync = async () => {
    if (window.confirm("This will overwrite all database products with the locally cleaned products.js file. Proceed?")) {
      try {
        let count = 0;
        for (const localProd of localProducts) {
          await setDoc(doc(db, "products", localProd.id.toString()), localProd);
          count++;
        }
        alert(`Successfully synced ${count} products to Firebase!`);
        onProductChange(); // Reload
      } catch (error) {
        console.error("Sync failed:", error);
        alert("Sync failed: " + error.message);
      }
    }
  };

  const handleEdit = (prod) => {
    setEditingId(prod.id);
    setFormData({ ...prod });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let finalData = { ...formData };
      if (typeof finalData.bullets === 'string') {
        finalData.bullets = Array.from(new Set(finalData.bullets.split('\n').map(b => b.trim()).filter(Boolean)));
      } else if (Array.isArray(finalData.bullets)) {
        finalData.bullets = Array.from(new Set(finalData.bullets.map(b => typeof b === 'string' ? b.trim() : b).filter(Boolean)));
      }
      finalData.priority = parseInt(finalData.priority) || 0;
      
      // Ensure the ID is a string for the document reference
      const docId = finalData.id.toString();
      
      // Use setDoc with merge: true to either create or update the document
      await setDoc(doc(db, "products", docId), finalData, { merge: true });
      
      onProductChange(); // Trigger reload
      setEditingId(null);
      setFormData({});
      alert("Product saved successfully!");
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id.toString()));
        onProductChange(); // Trigger reload
        alert("Product deleted successfully.");
      } catch (error) {
        console.error("Error deleting:", error);
        alert("Error deleting product: " + error.message);
      }
    }
  };

  const handleAdd = () => {
    const newId = Date.now().toString();
    setEditingId('new');
    setFormData({
      id: newId,
      name: '',
      category: "Men's Health",
      subniche: '',
      priority: 0,
      description: '',
      bullets: '',
      rationale: '',
      affiliateLink: '',
      image: '',
      status: 'active'
    });
  };

  return (
    <div style={{ padding: '1rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Package size={20} color="var(--primary)" /> Product Inventory
        </h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={handleForceSync} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.9rem', background: '#f1f5f9', border: '1px solid #cbd5e1' }}>
            Sync Local Data
          </button>
          <button className="btn-primary" onClick={handleAdd} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.9rem' }}>
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search products by name, category, or subniche..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 16px 10px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', background: '#fff' }}
          />
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          {search && (
            <button 
              onClick={() => setSearch('')}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={10} />
            </button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '0 12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
          {filteredProducts.length} Products
        </div>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ cursor: 'pointer' }} onClick={() => requestSort('image')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Image {getSortIcon('image')}</div>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => requestSort('name')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Name {getSortIcon('name')}</div>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => requestSort('category')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Category {getSortIcon('category')}</div>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => requestSort('subniche')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Subniche {getSortIcon('subniche')}</div>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => requestSort('priority')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Priority {getSortIcon('priority')}</div>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => requestSort('status')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Status {getSortIcon('status')}</div>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => requestSort('gender')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Gender {getSortIcon('gender')}</div>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {editingId === 'new' && (
              <tr style={{ background: '#f8fafc' }}>
                <td colSpan="8">
                  <ProductForm 
                    formData={formData} 
                    setFormData={setFormData}
                    handleChange={handleChange} 
                    handleSave={handleSave} 
                    handleCancel={handleCancel} 
                  />
                </td>
              </tr>
            )}
            {filteredProducts.map(prod => (
              <React.Fragment key={prod.id}>
                {editingId === prod.id ? (
                  <tr style={{ background: '#f8fafc' }}>
                    <td colSpan="8">
                      <ProductForm 
                        formData={formData} 
                        setFormData={setFormData}
                        handleChange={handleChange} 
                        handleSave={handleSave} 
                        handleCancel={handleCancel} 
                      />
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td>
                      {prod.image && <img src={prod.image} alt={prod.name} style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' }} />}
                    </td>
                    <td><strong style={{ color: 'var(--text)' }}>{prod.name}</strong></td>
                    <td>{prod.category}</td>
                    <td>{prod.subniche}</td>
                    <td>{prod.priority}</td>
                    <td>
                      {prod.status === 'inactive' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#ef4444', background: '#fef2f2', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' }}>
                          <XCircle size={14} /> Inactive
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981', background: '#ecfdf5', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' }}>
                          <CheckCircle2 size={14} /> Active
                        </span>
                      )}
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{prod.gender || 'Both'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEdit(prod)} style={{ background: 'transparent', border: 'none', color: '#0084ff', cursor: 'pointer' }} title="Edit">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(prod.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProductForm = ({ formData, setFormData, handleChange, handleSave, handleCancel }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImageUpload = (file) => {
    if (!file) return;
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);
    uploadTask.on('state_changed', 
      (snapshot) => {
        const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(prog);
      }, 
      (error) => {
        console.error("Upload failed", error);
        setUploading(false);
        alert("Upload failed: " + error.message);
      }, 
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData(prev => ({ ...prev, image: downloadURL }));
        setUploading(false);
        setProgress(0);
      }
    );
  };

  return (
  <form onSubmit={handleSave} style={{ padding: '1rem', display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
    <div>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#64748b' }}>Product Name</label>
      <input required name="name" value={formData.name || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
    </div>
    <div>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#64748b' }}>Image</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {formData.image ? (
          <div style={{ position: 'relative', width: '40px', height: '40px', flexShrink: 0 }}>
            <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff' }} />
            <button type="button" onClick={() => setFormData(prev => ({ ...prev, image: '' }))} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', padding: 0 }} title="Remove Image">&times;</button>
          </div>
        ) : (
          <div style={{ flexShrink: 0 }}>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} style={{ display: 'none' }} id="image-upload" />
            <label htmlFor="image-upload" style={{ display: 'inline-block', padding: '8px 12px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '6px', cursor: 'pointer', color: '#64748b', fontSize: '0.85rem', margin: 0, minWidth: '80px', textAlign: 'center' }}>
              {uploading ? `${progress}%` : '📁 Upload'}
            </label>
          </div>
        )}
        <input name="image" value={formData.image || ''} onChange={handleChange} placeholder="Or enter URL directly" style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', minWidth: '0' }} />
      </div>
    </div>
    <div>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#64748b' }}>Category</label>
      <input required name="category" value={formData.category || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
    </div>
    <div>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#64748b' }}>Subniche</label>
      <input required name="subniche" value={formData.subniche || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
    </div>
    <div>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#64748b' }}>Priority Score</label>
      <input type="number" name="priority" value={formData.priority || 0} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
    </div>
    <div>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#64748b' }}>Status</label>
      <select name="status" value={formData.status || 'active'} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
    <div>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#64748b' }}>Target Gender</label>
      <select name="gender" value={formData.gender || 'both'} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="both">Both</option>
      </select>
    </div>
    <div style={{ gridColumn: '1 / -1' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#64748b' }}>Description</label>
      <input required name="description" value={formData.description || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
    </div>
    <div style={{ gridColumn: '1 / -1' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#64748b' }}>Clinical Rationale</label>
      <textarea name="rationale" value={formData.rationale || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', minHeight: '60px' }} />
    </div>
    <div style={{ gridColumn: '1 / -1' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#64748b' }}>Key Mechanisms (Bullets - one per line)</label>
      <textarea name="bullets" value={Array.isArray(formData.bullets) ? formData.bullets.join('\n') : (formData.bullets || '')} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', minHeight: '80px' }} />
    </div>
    <div style={{ gridColumn: '1 / -1' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#64748b' }}>Affiliate Link</label>
      <input required name="affiliateLink" value={formData.affiliateLink || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
    </div>
    
    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1rem' }}>
      <button type="button" onClick={handleCancel} className="btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
      <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>Save Product</button>
    </div>
  </form>
  );
};

export default ProductsAdmin;
