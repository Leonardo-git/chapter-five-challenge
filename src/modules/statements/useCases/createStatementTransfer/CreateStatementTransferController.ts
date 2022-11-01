import { Request, Response } from "express";
import { container, inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementTransferUseCase } from "./CreateStatementTransferUseCase";
import { ICreateStatementTransferDTO } from "./ICreateStatementTransferDTO";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

@injectable()
export class CreateStatementTransferController {
  async execute(request: Request, response: Response) {
    const { sender_id } = request.params;
    const { id } = request.user;
    const { amount, description } = request.body;

    const type = "transfer" as OperationType;

    const createStatementTransferUseCase = container.resolve(
      CreateStatementTransferUseCase
    );

    const transfer = await createStatementTransferUseCase.execute({
      amount,
      description,
      type,
      user_id: id,
      sender_id
    });
    
    return response.status(201).json(transfer);
  }
}