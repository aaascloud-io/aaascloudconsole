package com.ifocus.aaascloud.util;

import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Enumを操作するための便利なメソッドを提供するユーティリティ.
 */
public final class EnumUtils {

    /**
     * 文字列から、それに対応するEnumを検索して返す.<br>
     * 見つからなかった場合は、 {@code Optional.empty()} を返す.
     *
     * @param enums 検索対象のEnum配列（{@code values} メソッドをそのまま渡す想定）
     * @param valueGetter Enumを受け取り、{@code value}と比較するための文字列を返すFunction
     * @param value 処理対象文字列
     * @return 文字列に対応するEnum（Optional）
     */
    public static <E extends Enum<E>> Optional<E> ofOptional(E[] enums,
                                                             Function<E, String> valueGetter, String value) {
        return Stream.of(enums).filter(t -> Objects.equals(valueGetter.apply(t), value)).findAny();
    }

    /**
     * 文字列から、それに対応するEnumを検索して返す.<br>
     * 見つからなかった場合は、 {@code IllegalArgumentException} がスローされる.
     *
     * @param enums 検索対象のEnum配列（{@code values} メソッドをそのまま渡す想定）
     * @param valueGetter Enumを受け取り、{@code value}と比較するための文字列を返すFunction
     * @param value 処理対象文字列
     * @return 文字列に対応するEnum（Optional）
     */
    public static <E extends Enum<E>> E of(E[] enums, Function<E, String> valueGetter,
                                           String value) {
        return ofOptional(enums, valueGetter, value)
                .orElseThrow(() -> new IllegalArgumentException("Illegal value: [" + value + "]"));
    }

    /**
     * Enumの配列をMapに変換する.<br>
     * 変換ルールは第2引数、第3引数で指定が可能
     *
     * @param enums Enum配列
     * @param keyMapper Enumを受け取り、MapのKeyとなる値を返すFunction
     * @param valueMapper Enumを受け取り、MapのValueとなる値を返すFunction
     * @return Map
     */
    public static <E extends Enum<E>, K, V> Map<K, V> toMap(E[] enums, Function<E, K> keyMapper,
                                                            Function<E, V> valueMapper) {
        return Stream.of(enums).collect(Collectors.toMap(keyMapper, valueMapper));
    }

}
