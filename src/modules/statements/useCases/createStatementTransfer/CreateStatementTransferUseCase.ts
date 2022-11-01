import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ICreateStatementTransferDTO } from "./ICreateStatementTransferDTO";

@injectable()
export class CreateStatementTransferUseCase {
  constructor(
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute(data: ICreateStatementTransferDTO) {
    const { sender_id, user_id, amount, description, type } = data;
  
    const userExists = await this.usersRepository.findById(String(sender_id));

    if (!userExists) {
      throw new AppError("Receiver not found");
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id });

    if (balance < amount) {
      throw new AppError("Insufficient funds");
    }

    return await this.statementsRepository.transfer({
      amount,
      description,
      type,
      user_id,
      sender_id
    })
  }
}