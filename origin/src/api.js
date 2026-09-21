import express from 'express';
import { TinkoffInvestApi } from 'tinkoff-invest-api';

const app = express();
app.use(express.json());

app.post('/api/accounts', async (req, res) => {
  try {
    const api = new TinkoffInvestApi({ token: req.body.token });
    const { accounts } = await api.users.getAccounts({});
    console.log(accounts);

    res.json({
      accounts: accounts.map((a) => ({
        id: a.id,
        name: a.name,
        type: a.type,
        status: a.status,
      })),
    })
    console.log(res);
  } catch {
    res.status(400).json({ error: 'Неверный токен' });
  }
});

app.post('/api/portfolio', async (req, res) => {
  try {
    const api = new TinkoffInvestApi({ token: req.body.token });
    const { positions, totalAmountShares, expectedYield } =
      await api.operations.getPortfolio({ accountId: req.body.accountId });

    // Конвертация Quotation (units + nano) в число
    const toNumber = (q) =>
      Number(q.units) + q.nano / 1e9;

    res.json({
      totalAmount: toNumber(totalAmountShares),
      expectedYield: toNumber(expectedYield),
      positions: positions.map((p) => ({
        figi: p.figi,
        instrumentType: p.instrumentType,
        quantity: Number(p.quantity),
        averagePrice: toNumber(p.averagePositionPrice),
        currentPrice: toNumber(p.currentPrice),
        expectedYield: toNumber(p.expectedYield),
      })),
    });
  } catch {
    res.status(400).json({ error: 'Не удалось получить портфель' });
  }
});

app.listen(5173, () => console.log('Server running on http://localhost:3000'));