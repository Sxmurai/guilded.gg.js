export const event = (name: string) => {
  return <T extends new (...args: any[]) => Event>(target: T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(name);
        void args;
      }
    };
  };
};

export class Event {
  public id: string;

  public constructor(id: string) {
    this.id = id;
  }
}