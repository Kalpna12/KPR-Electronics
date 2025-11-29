const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/quote', (req, res) => {
  console.log('Quote Request:', req.body);
  // TODO: Save to DB or send email
  res.status(200).json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
