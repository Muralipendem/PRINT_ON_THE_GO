import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  file_url: { type: String, required: true },
  paper_size: { type: String, required: true },
  copies: { type: Number, required: true },
  uploaded_at: { type: Date, default: Date.now }
});

const File = mongoose.model('File', fileSchema);

export default File;
