import { Request, Response } from 'express';
import Sweet from '../models/Sweet';

export const getSweets = async (req: Request, res: Response) => {
    try {
        const sweets = await Sweet.find();
        res.json(sweets);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const searchSweets = async (req: Request, res: Response) => {
    try {
        const { q, minPrice, maxPrice } = req.query;
        let filter: any = {};

        if (q) {
            filter.$or = [
                { name: { $regex: q as string, $options: 'i' } },
                { category: { $regex: q as string, $options: 'i' } }
            ];
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const sweets = await Sweet.find(filter);
        res.json(sweets);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

export const createSweet = async (req: Request, res: Response) => {
    try {
        const { name, category, price, quantity } = req.body;
        const newSweet = new Sweet({
            name,
            category,
            price,
            quantity
        });
        const sweet = await newSweet.save();
        res.status(201).json(sweet);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const updateSweet = async (req: Request, res: Response) => {
    try {
        let sweet = await Sweet.findById(req.params.id);
        if (!sweet) return res.status(404).json({ msg: 'Sweet not found' });

        await Sweet.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        // Return updated document
        sweet = await Sweet.findById(req.params.id);
        res.json(sweet);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

export const deleteSweet = async (req: Request, res: Response) => {
    try {
        let sweet = await Sweet.findById(req.params.id);
        if (!sweet) return res.status(404).json({ msg: 'Sweet not found' });

        await Sweet.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

export const purchaseSweet = async (req: Request, res: Response) => {
    try {
        const { qty } = req.body;
        const quantityToBuy = qty || 1;

        const sweet = await Sweet.findById(req.params.id);
        if (!sweet) {
            return res.status(404).json({ msg: 'Sweet not found' });
        }

        if (sweet.quantity < quantityToBuy) {
            return res.status(400).json({ msg: 'Not enough stock' });
        }

        sweet.quantity -= quantityToBuy;
        await sweet.save();

        res.json(sweet);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const restockSweet = async (req: Request, res: Response) => {
    try {
        const { qty } = req.body;
        const quantityToAdd = qty || 10;

        const sweet = await Sweet.findById(req.params.id);
        if (!sweet) return res.status(404).json({ msg: 'Sweet not found' });

        sweet.quantity += quantityToAdd;
        await sweet.save();

        res.json(sweet);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
