import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class CustomButton extends StatefulWidget {
  final String text;
  final VoidCallback? onPressed;
  final Color backgroundColor;
  final Color textColor;
  final IconData? icon;
  final bool isFullWidth;
  final double height;
  final bool isLoading;

  const CustomButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.backgroundColor = AppColors.royalBlue,
    this.textColor = AppColors.pureWhite,
    this.icon,
    this.isFullWidth = true,
    this.height = 52,
    this.isLoading = false,
  });

  @override
  State<CustomButton> createState() => _CustomButtonState();
}

class _CustomButtonState extends State<CustomButton> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    final double offset = _isPressed ? 1.0 : 3.5;

    return GestureDetector(
      onTapDown: (_) => setState(() => _isPressed = true),
      onTapUp: (_) {
        setState(() => _isPressed = false);
        if (!widget.isLoading && widget.onPressed != null) {
          widget.onPressed!();
        }
      },
      onTapCancel: () => setState(() => _isPressed = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 70),
        width: widget.isFullWidth ? double.infinity : null,
        height: widget.height,
        margin: EdgeInsets.only(top: _isPressed ? 2.5 : 0, bottom: _isPressed ? 0 : 2.5),
        padding: const EdgeInsets.symmetric(horizontal: 20),
        decoration: BoxDecoration(
          color: widget.backgroundColor,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: AppColors.borderDark,
            width: AppColors.borderWidth,
          ),
          boxShadow: [
            BoxShadow(
              color: AppColors.borderDark,
              offset: Offset(offset, offset),
              blurRadius: 0,
            ),
          ],
        ),
        child: Center(
          child: widget.isLoading
              ? SizedBox(
                  width: 22,
                  height: 22,
                  child: CircularProgressIndicator(
                    strokeWidth: 2.5,
                    color: widget.textColor,
                  ),
                )
              : Row(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (widget.icon != null) ...[
                      Icon(widget.icon, color: widget.textColor, size: 20),
                      const SizedBox(width: 8),
                    ],
                    Text(
                      widget.text,
                      style: TextStyle(
                        color: widget.textColor,
                        fontWeight: FontWeight.w900,
                        fontSize: 15,
                        letterSpacing: 0.2,
                      ),
                    ),
                  ],
                ),
        ),
      ),
    );
  }
}
