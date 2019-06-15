// | 权限              |
// |------------------|
// | 0b00000000(0x00) |
// | 0b00000001(0x01) |
// | 0b00000011(0x03) |
// | 0b00000111(0x07) |
// | 0b00001111(0x0f) |

// TODO
export default class Permission {
  // 阅读权限，任何用户包括未登录的用户
  public static readonly READ: number = 0x0;

  // 发表评论权限，已登录用户拥有
  public static readonly COMMENT: number = 0x1;

  // 发表post权限
  public static readonly WRITE: number = 0x2;

  // 修改评论权限
  public static readonly MODERATE: number = 0x4;

  // 管理员权限
  public static readonly ADMIN: number = 0x8;
}
